
# Working with Pods: Deploy, Inspect, and Modify

So far, we’ve understood the architectural foundations of Kubernetes. Now it's time to get our hands dirty by working with the most fundamental unit of execution in Kubernetes — the **Pod**.

In this section, we’ll walk through:

- How to create and deploy a Pod
- How to inspect its configuration and logs
- How to edit and update Pods
- How to execute commands within a running Pod

Let’s begin by deploying a simple Pod.

---

## Deploying a Simple Pod

The most basic way to deploy a Pod is to use a YAML configuration file and apply it using the `kubectl` command-line tool.

### Anatomy of a Pod YAML File

A minimal Pod manifest typically includes **four top-level fields**:

```yaml
apiVersion: v1           # Version of the Kubernetes API to use
kind: Pod                # The type of object to create
metadata:                # Metadata such as name, labels
  name: my-pod
  labels:
    env: dev
spec:                    # Specification of the desired state
  containers:
    - name: my-container
      image: nginx:latest
```

Save this as `pod.yaml`.

### Deploy the Pod

To deploy this Pod, use the following command:

```bash
kubectl create -f pod.yaml
```

This command reads the YAML file and creates the Pod in the cluster.

---

## Verifying the Pod Status

After deploying, you’ll want to verify if the Pod is running correctly.

### Basic Pod Listing

```bash
kubectl get pods
```

To see more detailed information, including the Node and IP assignment:

```bash
kubectl get pods -o wide
```

---

## Viewing Pod Logs and Events

### View Container Logs

If your Pod runs a container that outputs logs (like a web server), use:

```bash
kubectl logs -f my-pod
```

The `-f` flag lets you stream the logs live, which is useful for debugging.

### View Pod Events

The `describe` command gives you a full breakdown of the Pod's lifecycle and associated events:

```bash
kubectl describe pod my-pod
```

This is functionally identical to:

```bash
kubectl describe pod/my-pod
```

The `Events:` section is particularly important for diagnosing issues like image pull errors or failed scheduling.

---

## Dry Run and YAML Generation

Sometimes, you don’t want to create a resource immediately. You just want to preview the manifest or save it for later.

### Dry Run to Preview

```bash
kubectl run my-nginx --image=nginx --dry-run=client
```

This will simulate the creation without actually creating the Pod.

### Generate YAML Without Creating

To generate the YAML manifest and save it to a file:

```bash
kubectl run my-nginx --image=nginx --dry-run=client -o yaml > pod1.yaml
```

You can now inspect the manifest:

```bash
cat pod1.yaml
```

You can then modify it as needed and deploy using:

```bash
kubectl apply -f pod1.yaml
```

This brings us to the key difference between `kubectl create` and `kubectl apply`:

- `create` is used for **initial creation** only. It will fail if the resource already exists.
- `apply` is used for **both creation and updates**. It’s the preferred method in real-world usage and automation pipelines.

---

## Modifying Running Pods

If you need to make changes to a running Pod, Kubernetes offers multiple ways:

### 1. Edit Live Resource

This command opens the Pod spec in your default editor (usually Vim):

```bash
kubectl edit pod my-pod
```

After saving, Kubernetes attempts to apply the changes in-place.

To verify that your changes were applied:

- Use `kubectl describe pod my-pod` to view the updated configuration
- Or use `kubectl get pod my-pod -o yaml` or `-o json` to view the full state

### 2. Edit the YAML File and Apply

If you prefer to work with version-controlled YAML files:

1. Open `pod1.yaml` in an editor and make the changes
2. Apply the updated configuration:

```bash
kubectl apply -f pod1.yaml
```

This is a common pattern in production environments where all resources are managed as code.

---

## Executing Commands Inside a Pod

Sometimes you may want to debug inside a container, similar to SSHing into a VM. Kubernetes allows this with the `exec` command.

### Open a Shell Session

```bash
kubectl exec -it my-pod -- /bin/bash
```

If your container uses `sh` instead of `bash`, adjust accordingly:

```bash
kubectl exec -it my-pod -- /bin/sh
```

The `-it` flag stands for interactive terminal. Once inside, you can inspect files, check environment variables, or run diagnostics.

To exit the shell, simply run:

```bash
exit
```

---

## Summary

|Task|Command|
|---|---|
|Create Pod from YAML|`kubectl create -f pod.yaml`|
|List Pods|`kubectl get pods`|
|View Pod in detail|`kubectl describe pod my-pod`|
|Stream container logs|`kubectl logs -f my-pod`|
|Dry-run a Pod creation|`kubectl run --image=nginx --dry-run=client`|
|Generate YAML from run|`kubectl run --image=nginx --dry-run=client -o yaml > pod1.yaml`|
|Apply YAML changes|`kubectl apply -f pod1.yaml`|
|Edit Pod live|`kubectl edit pod my-pod`|
|Open shell in Pod|`kubectl exec -it my-pod -- /bin/bash`|

---

This section lays the foundation for working with Pods directly, which is a crucial step before moving on to more advanced Kubernetes objects like **Deployments**, **ReplicaSets**, and **Services**, where we’ll introduce automation, scaling, and service discovery.

Let me know when you're ready to move to the next chapter.