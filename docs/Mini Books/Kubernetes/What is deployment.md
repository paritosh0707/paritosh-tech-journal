# Deployments in Kubernetes: Introduction

In the previous chapters, we learned how to define and launch **Pods**, the most basic execution unit in Kubernetes. While Pods are useful for running applications, managing them manually—especially at scale—quickly becomes inefficient and error-prone.

Imagine this:

- A Pod crashes unexpectedly—who brings it back?
- You need to run multiple identical Pods—how do you ensure consistency?
- You want to update the container image for your app—how do you do that with zero downtime?

This is where **Deployments** come in.

A **Deployment** is a higher-level Kubernetes object that allows you to:

- Define your application's desired state
- Run and maintain multiple replicas
- Perform rolling updates to new versions
- Automatically replace failed or outdated Pods
- Roll back to a previous stable version if something goes wrong

Deployments make your workloads **self-healing, declarative, and version-controlled**—essential characteristics for modern cloud-native systems.

In this chapter, we'll explore:

- What Deployments are and how they work behind the scenes
- How to create, scale, update, and delete Deployments
- How Kubernetes handles rollouts and rollbacks with zero downtime
- The role of ReplicaSets and how they relate to Deployments and Pods

By the end of this chapter, you'll be able to manage applications in Kubernetes confidently using Deployments as the foundational building block.

Let's begin with the core concepts.

## Why Do We Need Deployments in Kubernetes?

So far, we've learned how to create and manage Pods directly. While this is useful for learning and for one-off debugging tasks, managing Pods manually in production is **not scalable or fault-tolerant**.

Let's walk through a few real-world challenges.

### 1. What happens if your Pod crashes?

If you create a Pod manually using `kubectl create -f pod.yaml`, and the Pod crashes or the node hosting it fails, **Kubernetes does not recreate it**. You'll have to re-run it yourself.

### 2. How do you scale manually created Pods?

If you want 5 copies of your application running, you'll need to manually create 5 Pod definitions. Managing them individually becomes impractical as the number grows.

### 3. What if you want to update the image version?

You'd need to manually delete and recreate Pods or edit each one individually, which risks downtime and inconsistency.

These limitations are what **Deployments** solve.

A **Deployment** in Kubernetes provides a higher-level abstraction that manages the lifecycle of Pods **in a declarative and automated manner**.

## Core Concepts of Deployment
### What is a Deployment?

A **Deployment** is a Kubernetes object that defines:

- What kind of Pods to run
- How many replicas to maintain
- How to update them
- What to do if something goes wrong

It ensures that the declared state is always maintained — even if Pods fail, the system will bring them back automatically. It also provides mechanisms for:

- **Scaling**
- **Rolling updates**
- **Rollbacks**
- **Declarative configuration**

In essence, a Deployment manages a **ReplicaSet**, which in turn manages **Pods**.

### Deployment Controller: The Automation Engine Behind Deployments

Once you understand what a Deployment is—essentially a desired state specification for your application—the natural next step is to explore what ensures that this desired state is actually achieved and continuously maintained. This is where the **Deployment Controller** comes in.

The Deployment Controller is a core component of the Kubernetes control plane that **automates the creation, scaling, and rolling updates of Pods** through ReplicaSets. It acts as a background reconciliation loop, ensuring that the current state of your cluster converges toward the desired state you define in your Deployment manifest.

#### Role of the Deployment Controller

At its core, the Deployment Controller performs the following responsibilities:

1. **Ensures Desired Replica Count**  
    When you specify a `replicas` field in your Deployment YAML (say, 3 replicas), the Deployment Controller ensures that exactly 3 Pods are always running. If one crashes or gets deleted, it immediately instructs the ReplicaSet to spin up a new Pod.
    
2. **Orchestrates Rolling Updates**  
    If you update the container image or any other spec in the Pod template, the controller **gracefully transitions** from the old ReplicaSet to a new one using the specified update strategy (typically `RollingUpdate`).
    
3. **Maintains History for Rollbacks**  
    Kubernetes automatically maintains a history of prior ReplicaSets. If a rollout fails or has an issue, the controller allows you to roll back to a previous state using:
    
    ```bash
    kubectl rollout undo deployment <deployment-name>
    ```
    
4. **Monitors and Reports Status**  
    The Deployment Controller constantly tracks the status of the Deployment and updates status fields such as:
    
    - `availableReplicas`
    - `updatedReplicas`
    - `conditions` (e.g., progressing, complete)

#### A Visual Example: How Deployment Controller Works

Let's look at a scenario:

You have a Deployment manifest with 3 replicas and an image version `v1`:

```yaml
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          image: myapp:v1
```

The controller ensures that:

- A ReplicaSet is created to manage 3 Pods with image `myapp:v1`
- All 3 Pods are up and running

Now, you update the Deployment to use `myapp:v2`. Here's what happens:

- A **new ReplicaSet** is created for `myapp:v2`
- The controller gradually increases Pods from the new ReplicaSet while decreasing from the old one
- This process is governed by the `strategy.rollingUpdate` settings such as `maxUnavailable` and `maxSurge`
- Once the update is complete, the old ReplicaSet is scaled to zero but retained for rollback purposes

#### Behind the Scenes: How the Controller Reconciles

The Deployment Controller continuously compares two things:

- **Desired state**: Defined in the Deployment object
- **Current state**: Actual state in the cluster (Pods running, image versions, number of replicas)

If there's any drift, the controller reconciles by adjusting the underlying ReplicaSets. This reconciliation loop is **event-driven**, meaning it reacts to changes such as updated Deployment specs or failed Pods.

#### In Short

The Deployment Controller is the **engine** that brings declarative configuration in Kubernetes to life. While the Deployment object is your intent, the controller ensures that reality conforms to that intent, automatically handling scaling, updates, and health management. By offloading this operational burden, the controller enables you to focus on application logic rather than infrastructure orchestration.

If you are comfortable with Deployments as YAML specs, understanding the Deployment Controller helps you see the full picture—how Kubernetes ensures availability, consistency, and progressive delivery with minimal manual intervention.

Let me know if you'd like to add diagrams or animation suggestions that visually show rolling updates or reconciliation loops.

### Pod vs ReplicaSet vs Deployment: Understanding the Hierarchy

To grasp Deployments fully, it's important to understand how it fits in the hierarchy of Kubernetes objects.

|Object|Role|
|---|---|
|**Pod**|The basic unit of deployment. Represents one or more containers.|
|**ReplicaSet**|Ensures that a specified number of **identical Pods** are running at all times. If one Pod crashes, the ReplicaSet spins up another.|
|**Deployment**|Manages ReplicaSets. Provides declarative updates to Pods and ReplicaSets. Also handles rolling updates, rollbacks, and revision history.|

#### Analogy:

Think of this in terms of a team structure:

- A **Pod** is like an individual team member.
- A **ReplicaSet** is like a manager who ensures the team always has the right number of members.
- A **Deployment** is the department head who can reorganize the team, change how it operates, and roll back to previous team setups if something goes wrong.

You rarely manage ReplicaSets directly in practice. Instead, you define a Deployment, and Kubernetes takes care of the ReplicaSet and Pods underneath.

### Deployment YAML: Structure and Key Fields

Here is a minimal example of a Deployment definition:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25.2
          ports:
            - containerPort: 80
```

#### Breakdown of Key Fields:

- **apiVersion**: Always `apps/v1` for Deployments
- **kind**: Must be `Deployment`
- **metadata**: Metadata about the deployment object
- **spec.replicas**: Number of desired Pods to be running at all times
- **spec.selector**: A required field that defines how the Deployment finds which Pods to manage
- **spec.template**: Template for creating new Pods
    - **metadata.labels**: Must match `spec.selector.matchLabels`
    - **spec.containers**: Actual containers to run

### Labels and Selectors: The Glue of Deployments

Labels and selectors play a critical role in tying the Deployment to its Pods (and ReplicaSet).

#### Labels

Labels are key-value pairs attached to Kubernetes objects. For example:

```yaml
labels:
  app: nginx
```

#### Selectors

Selectors define how a Deployment identifies the Pods it is supposed to manage. For example:

```yaml
selector:
  matchLabels:
    app: nginx
```

If the labels in the Pod template do **not** match the selector, the Deployment will fail.

This tight coupling ensures that Deployments only manage the Pods they are responsible for.

### Summary

Deployments bring automation, resilience, and scalability to Kubernetes workloads. While Pods are great for simple use-cases, **Deployments are essential** for production environments where uptime, updates, and rollbacks must be handled with precision.

## Creating and Managing Deployments in Kubernetes

After understanding what Deployments are and why they're essential, the next step is to learn how to **create, inspect, modify, and delete** them effectively.

### Creating a Deployment using YAML and `kubectl`

The most production-friendly way to create a Deployment is through a **YAML manifest**. This ensures your configuration is version-controlled, declarative, and repeatable.

#### Sample Deployment YAML (`nginx-deployment.yaml`)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.25.2
          ports:
            - containerPort: 80
```

#### Apply the Deployment

```bash
kubectl apply -f nginx-deployment.yaml
```

This creates the Deployment, which in turn creates a **ReplicaSet** and **Pods**. Kubernetes takes over the responsibility of ensuring the desired state (2 replicas in this case) is always met.

### Inspecting Deployments

Once the Deployment is created, you'll want to inspect it using various `kubectl` commands.

#### Get Deployments

```bash
kubectl get deployments
```

To view more details like the number of available/unavailable replicas:

```bash
kubectl get deployment nginx-deployment -o wide
```

#### Get Related ReplicaSets and Pods

```bash
kubectl get replicasets
kubectl get pods -l app=nginx
```

This ensures that the Pods are actually running and managed by the Deployment.

#### Describe Deployment

```bash
kubectl describe deployment nginx-deployment
```

This provides comprehensive details including:

- ReplicaSet references
- Events such as pod creation or failures
- Current state vs. desired state

#### Logs of a Pod Managed by a Deployment

To fetch logs from a container running inside one of the Pods:

```bash
kubectl get pods
kubectl logs pod-name
```

Since Deployments manage Pods indirectly, you always inspect logs from **Pods**, not the Deployment itself.

### Editing Deployments

There are two main ways to update a Deployment: **live editing** or **reapplying YAML**.

#### Method 1: Live Editing Using `kubectl edit`

```bash
kubectl edit deployment nginx-deployment
```

This opens the Deployment manifest in a terminal editor (usually Vim). You can:

- Change the replica count
- Update the image version
- Modify labels, ports, or other fields

Once saved, Kubernetes will automatically apply the change. For example, changing the image from `nginx:1.25.2` to `nginx:1.26.0` triggers a **rolling update**.

#### Method 2: Modify YAML and Reapply

This is the preferred method in teams where YAML is stored in Git or used in CI/CD pipelines.

1. Edit `nginx-deployment.yaml` locally
2. Apply it again:

```bash
kubectl apply -f nginx-deployment.yaml
```

The `apply` command detects changes and updates the existing resource declaratively.

> `apply` can be used both for **creating new resources** and **updating existing ones**.

### Deleting Deployments

To completely remove a Deployment (and its underlying ReplicaSet and Pods):

```bash
kubectl delete deployment nginx-deployment
```

This:

- Deletes the Deployment object
- Deletes the associated ReplicaSet(s)
- Deletes all Pods managed by those ReplicaSets

To confirm deletion:

```bash
kubectl get deployments
kubectl get pods
```

You should no longer see the Deployment or any related Pods.

### Summary

|Action|Command|
|---|---|
|Create Deployment|`kubectl apply -f deployment.yaml`|
|View Deployments|`kubectl get deployments`|
|Inspect a Deployment|`kubectl describe deployment <name>`|
|View logs|`kubectl logs <pod-name>`|
|Edit live|`kubectl edit deployment <name>`|
|Reapply YAML|`kubectl apply -f deployment.yaml`|
|Delete Deployment|`kubectl delete deployment <name>`|

Deployments abstract away the complexity of managing Pods directly, and these commands are your everyday tools for working with them.

## Managing Replicas in Kubernetes Deployments

One of the most important responsibilities of a Deployment is to ensure that the correct number of application instances (Pods) are always running. This is crucial for:

- Load distribution
- Fault tolerance
- High availability

Whether you're scaling your application manually or automatically, Deployments make this process straightforward and reliable.

### Setting and Updating `replicas` Count in YAML

The number of replicas you want Kubernetes to maintain is defined in the Deployment manifest using the `replicas` field.

#### Example:

```yaml
spec:
  replicas: 3
```

This tells Kubernetes to always keep **3 Pods** running that match the template.

If any of these Pods fail, the underlying **ReplicaSet** (managed by the Deployment) will automatically create new ones to maintain the desired count.

To update the count, simply modify the YAML:

```yaml
spec:
  replicas: 5
```

Then reapply the updated file:

```bash
kubectl apply -f deployment.yaml
```

Kubernetes will scale up or down accordingly.

### Scaling Manually Using `kubectl scale`

Instead of editing YAML, you can scale directly from the command line:

#### Scale Up:

```bash
kubectl scale deployment nginx-deployment --replicas=6
```

#### Scale Down:

```bash
kubectl scale deployment nginx-deployment --replicas=2
```

You can verify the scaling operation with:

```bash
kubectl get deployment nginx-deployment
kubectl get pods -l app=nginx
```

Behind the scenes:

- The Deployment updates the ReplicaSet
- The ReplicaSet adds or removes Pods to match the desired count

This manual scaling is useful for quick experiments or responding to short-term traffic changes.

### Introduction to Horizontal Pod Autoscaler (HPA)

While manual scaling is useful, in production you often want your system to **scale automatically based on metrics** like CPU or memory usage. That's where **Horizontal Pod Autoscaling** comes in.

#### What is HPA?

The **Horizontal Pod Autoscaler (HPA)** automatically adjusts the number of Pods in a Deployment (or ReplicaSet) based on real-time metrics.

For example:

- If average CPU usage exceeds 80%, HPA might scale from 3 to 6 Pods
- If load drops below a threshold, it can scale down to conserve resources

HPA uses the **Metrics Server** to gather data from the cluster. Once installed and configured, you can create an autoscaler like this:

```bash
kubectl autoscale deployment nginx-deployment --cpu-percent=70 --min=2 --max=10
```

This command means:

- Start with a minimum of 2 Pods
- Scale up to 10 if CPU usage exceeds 70%

You can check the status with:

```bash
kubectl get hpa
```

> Note: The **metrics-server** must be installed and running in the cluster. Without it, HPA will not have the data it needs to make scaling decisions.

### Summary

|Task|Command / YAML|
|---|---|
|Set replica count (YAML)|`spec.replicas: <number>`|
|Apply updated count|`kubectl apply -f deployment.yaml`|
|Scale manually|`kubectl scale deployment <name> --replicas=<n>`|
|Create HPA|`kubectl autoscale deployment <name> --cpu-percent=X --min=A --max=B`|
|View HPA status|`kubectl get hpa`|

Deployments allow you to scale your application with ease — either explicitly or automatically — making them a cornerstone for building resilient and elastic systems in Kubernetes.

## Rolling Updates and Rollbacks in Kubernetes

In any production system, updating applications without downtime or disruption is essential. Kubernetes Deployments provide built-in mechanisms to:

- Upgrade applications incrementally (rolling updates)
- Roll back to a previous stable state in case of failures

Let's walk through the full lifecycle of updating and reverting changes in a controlled and observable way.

### Update Strategies: `RollingUpdate` vs `Recreate`

The `strategy` field in a Deployment defines how updates are performed.

#### 1. `RollingUpdate` (default)

This is the default strategy and the most common one used in production.

- Gradually replaces old Pods with new ones
- Ensures **zero downtime**
- Useful for high-availability applications

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1
    maxSurge: 1
```

In this configuration:

- `maxUnavailable: 1` → At most one old Pod can be unavailable during the update
- `maxSurge: 1` → At most one extra Pod (beyond the desired replicas) can be created temporarily

This ensures that there's always a minimum number of available Pods during the update process.

#### 2. `Recreate`

This is a more aggressive strategy:

- Terminates **all existing Pods** before starting new ones
- Causes **temporary downtime**
- Can be useful when Pods can't run in parallel (e.g., apps that lock shared resources)

```yaml
strategy:
  type: Recreate
```

> Most modern applications are designed for rolling updates, so `Recreate` is rarely used.

### Update Parameters: `maxUnavailable` and `maxSurge`

These two fields fine-tune the behavior of rolling updates.

#### `maxUnavailable`

- The maximum number of Pods that can be **unavailable** during the update.
- Expressed as an absolute number or percentage.

#### `maxSurge`

- The maximum number of Pods that can be **created above the desired replica count** during the update.
- Also specified as a number or percentage.

Example:

```yaml
rollingUpdate:
  maxUnavailable: 25%
  maxSurge: 25%
```

If your deployment has 4 replicas:

- Up to 1 Pod can be unavailable (`25% of 4`)
- Up to 1 extra Pod can be scheduled during the update

### Performing and Monitoring Rolling Updates

#### Step 1: Change the Image

Update the image version in the deployment YAML:

```yaml
spec:
  containers:
    - name: nginx
      image: nginx:1.26.0
```

Then apply the change:

```bash
kubectl apply -f deployment.yaml
```

Kubernetes begins a rolling update:

- New Pods are scheduled
- Old Pods are terminated one-by-one
- Health checks are used to verify that new Pods are ready before proceeding

#### Step 2: Monitor the Progress

You can track the update using:

```bash
kubectl rollout status deployment nginx-deployment
```

This will show a live status of the rollout process.

Or describe the deployment:

```bash
kubectl describe deployment nginx-deployment
```

Look under the `Events:` section for messages about old Pods being terminated and new ones starting.

### Rollbacks: Reverting to a Previous Revision

Sometimes, an update introduces a bug or breaks functionality. In such cases, Kubernetes lets you **roll back to a previous version** easily.

#### Step 1: Rollback Command

```bash
kubectl rollout undo deployment nginx-deployment
```

This will roll back to the previous Deployment revision.

You can also roll back to a specific revision number:

```bash
kubectl rollout undo deployment nginx-deployment --to-revision=2
```

#### Step 2: Check Rollback Status

Monitor the rollback with:

```bash
kubectl rollout status deployment nginx-deployment
```

You can verify the current image/tag to confirm that the rollback was successful:

```bash
kubectl get deployment nginx-deployment -o yaml
```

### Viewing Deployment History and Revisions

Each Deployment change is versioned automatically.

#### View History:

```bash
kubectl rollout history deployment nginx-deployment
```

This shows all revisions along with their change-cause (if provided).

To inspect a specific revision:

```bash
kubectl rollout history deployment nginx-deployment --revision=2
```

To make rollback decisions easier, you can annotate your YAML with a change-cause:

```bash
kubectl annotate deployment nginx-deployment kubernetes.io/change-cause="Upgrade to nginx 1.26"
```

This will show up in the revision history.

### Summary

|Feature|Command|
|---|---|
|Change image/version|`kubectl apply -f deployment.yaml`|
|Monitor update|`kubectl rollout status deployment <name>`|
|Rollback to previous|`kubectl rollout undo deployment <name>`|
|Rollback to revision|`kubectl rollout undo deployment <name> --to-revision=<n>`|
|View history|`kubectl rollout history deployment <name>`|
|View specific revision|`kubectl rollout history deployment <name> --revision=<n>`|

Rolling updates and rollbacks are foundational for safe, continuous delivery of applications in Kubernetes. They eliminate downtime while providing full control over versioned deployments, making Kubernetes a powerful platform for modern software delivery.

## Summary: Kubernetes Deployments

In this chapter, we explored **Deployments**, one of the most critical abstractions in Kubernetes for managing application lifecycle at scale.

Below is a recap of the key concepts, tools, and workflows:

### 1. Why Do We Need Deployments?

- Pods created manually are **not self-healing** or scalable.
- Deployments allow us to **declaratively manage Pods**, ensuring availability and consistency.
- They introduce **automated rollout**, **rollback**, and **scaling** mechanisms out-of-the-box.

### 2. Core Concepts of Deployments

|Concept|Description|
|---|---|
|**Pod**|Smallest unit of deployment (container wrapper)|
|**ReplicaSet**|Ensures a specified number of identical Pods are running|
|**Deployment**|Manages ReplicaSets, provides declarative updates and rollback capabilities|
|**Labels & Selectors**|Connect Deployments to their managed Pods via metadata|
|**YAML Fields**|`apiVersion`, `kind`, `metadata`, and `spec` define the structure of a Deployment|

### 3. Creating and Managing Deployments

- Create Deployments using `kubectl apply -f <yaml>` or generate them with `kubectl run --dry-run`.
- Inspect with:
    - `kubectl get deployments`
    - `kubectl describe deployment <name>`
    - `kubectl get pods`, `logs`, and `replicasets` for related resources
- Modify Deployments via:
    - `kubectl edit deployment <name>`
    - Updating the YAML and reapplying with `kubectl apply`
- Delete a Deployment using `kubectl delete deployment <name>`

### 4. Replica Management

- Set the number of replicas in the YAML with `spec.replicas`
- Scale manually using:

    ```bash
    kubectl scale deployment <name> --replicas=<count>
    ```

- Use **Horizontal Pod Autoscaler (HPA)** to scale automatically based on metrics:

    ```bash
    kubectl autoscale deployment <name> --cpu-percent=70 --min=2 --max=10
    ```

### 5. Rolling Updates and Rollbacks

|Feature|Description|
|---|---|
|**Strategy Types**|`RollingUpdate` (default) and `Recreate`|
|**Update Parameters**|`maxUnavailable`, `maxSurge` control rollout granularity|
|**Rolling Update**|Triggered by image change or applied YAML|
|**Monitor Rollout**|`kubectl rollout status deployment <name>`|
|**Rollback**|Undo changes with `kubectl rollout undo deployment <name>`|
|**History**|Track with `kubectl rollout history deployment <name>` and annotate with change-cause|

### Final Thoughts

Kubernetes Deployments serve as the foundation for any reliable, maintainable, and scalable containerized system. They abstract complexity while offering full control over:

- Application versioning
- Lifecycle automation
- Recovery from failure
- Declarative configuration management

With Deployments mastered, you're now prepared to move into **Kubernetes Services**, where we tackle networking, service discovery, and routing traffic to these managed Pods.

