> ⏱️ Estimated reading time: 45 min

# Services in Kubernetes

## 1 Why Do We Need Services?

If you've followed along through Pods and Deployments, you're already familiar with how Kubernetes manages running containers. But there's an important question that arises the moment we want one Pod to talk to another, or we want to access our application from outside the cluster:

> **How do we reliably communicate with Pods that are constantly changing?**

Let's unpack why this is a real problem — and how **Services** provide a powerful solution.

### 1.1 The Volatile Nature of Pods

In Kubernetes, **Pods are ephemeral by design**. They are not meant to be permanent. A Pod may get recreated when:

- The node it was running on fails
- A Deployment is updated
- Horizontal scaling adjusts replica counts
- A crash occurs and the Pod is restarted

When this happens, the old Pod disappears and a **new one with a new IP address** takes its place.

This means that **you cannot rely on Pod IPs** for communication, not even for a short time. If another Pod or client tries to connect directly to that IP, it could fail — because the target Pod might no longer exist, or its address might have changed.

### 1.2 The Problem with Direct Pod Access

Let's say you've deployed a backend API with 3 replicas using a Deployment. These replicas are managed by Kubernetes, and they can come and go as needed.

Now imagine a frontend container wants to make a request to the backend.

- Should it track all 3 backend Pod IPs?
- What if one of them is deleted and a new one is added?
- What if the number of replicas changes dynamically?

This quickly becomes unmanageable. In traditional systems, we might have used a load balancer or a static IP address — but in Kubernetes, we need something **dynamic yet stable**.

This is where Services come in.

### 1.3 Services: A Stable Network Abstraction

A **Kubernetes Service** acts as a **stable endpoint** that you can use to access one or more Pods.

It sits in front of a group of Pods and routes traffic to them. Instead of talking to Pods directly, clients talk to the **Service**, which knows how to find the right Pods — even as they come and go.

Behind the scenes, a Service:

- Uses **label selectors** to dynamically discover matching Pods
- Maintains an internal **DNS name** (like `my-service.default.svc.cluster.local`)
- Load balances across healthy Pod endpoints

So now, the frontend can just send requests to `http://my-backend-service` — and Kubernetes ensures that those requests are forwarded to an appropriate backend Pod.

> _(See Image: Service routing traffic to rotating Pods — `image_service_vs_pods.png`)_

This separation between stable access (via Service) and dynamic compute (via Pods) is one of Kubernetes' most elegant design patterns. It decouples application logic from infrastructure churn — and that's incredibly powerful.

## 2 What Is a Service in Kubernetes?

A **Service** in Kubernetes is a core networking construct that provides a **stable way to access a group of Pods**. It abstracts away the dynamic nature of Pods and gives clients a consistent way to connect — regardless of how often the underlying Pods come and go.

Think of it as a **virtual permanent IP and DNS name** that load-balances traffic to healthy Pods behind the scenes.

### 2.1 Stable Networking Abstraction

In Kubernetes, every Pod gets its own IP address. But as we saw earlier, these IPs are not reliable — Pods can die and get replaced any time. If we had to hard-code IPs or update connections each time, application logic would become brittle and chaotic.

This is why **Services are essential**.

A Service provides:

- A **stable virtual IP address (ClusterIP)** inside the cluster
- A **consistent DNS name** that other Pods can use to connect
- **Load balancing** across all matching Pods
- **Health-aware routing** to ensure only ready Pods receive traffic

So instead of addressing a Pod directly, clients talk to the Service. Kubernetes then dynamically routes the request to one of the healthy Pods that matches the Service's selector.

### 2.2 Label Selector and Endpoint Matching

How does the Service know which Pods to send traffic to?

It uses **label selectors** — a fundamental Kubernetes concept we've seen before in Deployments.

Here's a quick recap:

- Each Pod can have labels (e.g., `app: backend`)
- A Service uses a selector like `app: backend` to find matching Pods
- Kubernetes then maintains a list of **Endpoints** behind the Service — which are the actual IPs of those Pods

This way, even if Pods are restarted or rescheduled, as long as their labels match, the Service will **automatically discover and include them**.

> **Example:**

```
selector:
	app: backend
```

This selector ensures that any Pod labeled `app=backend` is part of the Service's load-balanced backend pool.

### 2.3 Internal DNS Resolution

To make things even easier, Kubernetes runs a **built-in DNS service** that creates DNS records for every Service in the cluster.

If your Service is named `my-service`, and it's deployed in the `default` namespace, you can access it from any Pod using:

```
http://my-service.default.svc.cluster.local
```

Or more simply, if you're in the same namespace:

```
http://my-service
```

This DNS-based routing is incredibly powerful. It means that Pods don't need to know about IPs or even service endpoints — they just resolve a DNS name, and Kubernetes handles the rest.

> _(See Image: DNS resolution flow from Pod to Service — `image_dns_service_resolution.png`)_

## 3 Types of Services in Kubernetes

Kubernetes offers several types of Services to handle different access needs for Pods, whether internal or external. These include:

- **ClusterIP** (default)
- **NodePort**
- **LoadBalancer**
- **ExternalName**
- **Headless Services**

Let's begin with the default and most commonly used type: `ClusterIP`.

### 3.1 ClusterIP (Default)

The `ClusterIP` type is the default Service type in Kubernetes. It creates a **virtual IP address** that is accessible **only from within the cluster**. This means other Pods and Services can communicate with it, but anything outside the cluster cannot reach it directly.

This type is ideal for building **internal microservice architectures**, where services communicate with one another without exposing themselves to the outside world.

#### 3.1.1 The Purpose of ClusterIP

Imagine you have a backend API serving predictions from a machine learning model. This backend doesn't need to be accessed from the internet; it only needs to receive requests from an internal frontend service or an orchestrator job.

Without a Service, frontend Pods would have to discover backend Pods by their IPs — which change dynamically as Pods are recreated. This is clearly unmanageable.

A `ClusterIP` Service solves this by:

- Providing a **stable internal endpoint** (both IP and DNS)
- Load balancing across **all healthy Pods** that match the Service's selector
- Hiding the complexity of Pod creation and destruction from the client

#### 3.1.2 YAML Definition of a ClusterIP Service

Below is an example of a Service that exposes a Deployment named `backend`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 80         # Service port exposed internally
      targetPort: 5000 # Container port inside the Pod
  type: ClusterIP       # Optional; this is the default
```

Let's break this down:

- The Service is named `backend-service`
- It matches all Pods with label `app=backend`
- Requests made to port `80` on the Service will be forwarded to port `5000` inside the selected Pods
- The `type: ClusterIP` tells Kubernetes to create a virtual internal IP for this Service

The result is a stable network abstraction that allows any Pod in the same namespace to send a request to:

```
http://backend-service
```

Or, using the full DNS name:

```
http://backend-service.default.svc.cluster.local
```

#### 3.1.3 How ClusterIP Services Work Internally

Here's what happens behind the scenes:

1. Kubernetes continuously watches for Pods that match the Service's `selector`.
2. It maintains a dynamic list of **endpoints** (actual Pod IPs and ports).
3. When another Pod sends a request to the Service, Kubernetes routes it to one of the healthy endpoints — automatically load balancing across them.

> _(See Image: Internal traffic flow using ClusterIP — `image_clusterip_service_flow.png`)_

This design decouples the **client logic** from the **volatile nature of Pods**, allowing the system to scale or self-heal without service disruption.

#### 3.1.4 When to Use ClusterIP

Use a `ClusterIP` Service when:

- The application **only needs to be accessed internally** within the cluster.
- You're implementing **service-to-service communication** in a microservice architecture.
- You want to **hide backend components** from users or external systems.

ClusterIP Services are commonly used for:

- Internal APIs
- Database endpoints
- Machine learning inference services
- Background job processors

### 3.2 NodePort

A `NodePort` Service exposes a Pod or Deployment **outside the Kubernetes cluster** by opening a specific port on **every node** in the cluster. This allows external clients to access your application using the `<NodeIP>:<NodePort>` combination.

While `ClusterIP` is ideal for internal communication, `NodePort` makes your application reachable **from outside the cluster**, without requiring an external load balancer.

#### 3.2.1 Why Use NodePort?

Imagine you're developing a backend API or a small demo app and want to test it **from your local machine** or allow someone outside the cluster to make requests to it.

With `ClusterIP`, you'd be stuck — it's only accessible from within the cluster.

But with `NodePort`:

- Kubernetes exposes your Service on the **same port** across **all nodes** in the cluster.
    
- You can access your app using:
    
    ```
    http://<node-ip>:<node-port>
    ```
    
- Under the hood, traffic hitting the node is routed to the corresponding `ClusterIP` Service, and from there to the appropriate Pod.
    

#### 3.2.2 NodePort YAML Example

Here's a basic example of a `NodePort` Service that exposes a backend Deployment:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  type: NodePort
  ports:
    - protocol: TCP
      port: 80           # Port clients inside the cluster use
      targetPort: 5000   # Port on the container
      nodePort: 30080    # Static port on all nodes (30000–32767)
```

Explanation:

- `port`: Port exposed by the Service inside the cluster
- `targetPort`: Port exposed by the Pod
- `nodePort`: Port opened on all nodes to accept traffic from outside

If you skip the `nodePort` field, Kubernetes will automatically assign a port in the range `30000–32767`.

#### 3.2.3 How NodePort Works

Let's say:

- One of your Kubernetes nodes has the IP `192.168.1.10`
- Your Service's `nodePort` is `30080`

You (or any external system) can now access the backend app at:

```
http://192.168.1.10:30080
```

The request will:

1. Hit the node at port `30080`
2. Be forwarded by kube-proxy to the internal `ClusterIP` of the Service
3. Load-balanced to one of the matching backend Pods

> _(See Image: NodePort routing from external client to Pod — `image_nodeport_service_flow.png`)_

#### 3.2.4 When to Use NodePort

Use `NodePort` when:

- You need **basic external access** to your app for testing or lightweight use
- You don't have a cloud provider-managed load balancer
- You want to **build your own ingress/load balancer** manually

However, be cautious:

- NodePorts are **not recommended for production-scale public services**
- You must **manage node IPs and firewall rules** yourself
- Only one Service can use a particular `nodePort` at a time

!!! note
    Even though `NodePort` allows external access, it's often used behind a reverse proxy or an Ingress Controller — especially in cloud-native architectures.

### 3.3 LoadBalancer

A `LoadBalancer` Service creates a **publicly accessible IP address** and connects it to a set of Pods via a cloud provider's **Layer 4 (TCP/UDP) load balancer**.

It builds on top of `ClusterIP` and `NodePort`, but with one major advantage: the external routing is **fully managed by the cloud platform** — such as AWS, Azure, or GCP.

#### 3.3.1 Why Use LoadBalancer?

Let's say you're running a production-grade API or a machine learning inference server, and you want clients from the internet to reach it securely and reliably.

- `ClusterIP` isn't accessible externally.
- `NodePort` works, but you have to manage node IPs, ports, and routing yourself.

With `LoadBalancer`, Kubernetes takes care of provisioning an external IP and configuring routing for you — via the cloud provider's native infrastructure.

> As a result, this is the **go-to approach** for exposing services in cloud-hosted Kubernetes clusters.

#### 3.3.2 What It Does Behind the Scenes

When you create a `LoadBalancer` Service:

1. Kubernetes provisions a `ClusterIP` and a `NodePort` automatically.
2. It then requests a **cloud-managed load balancer**, which is wired to the `NodePort`.
3. The load balancer receives external traffic on a **public IP address**.
4. It forwards requests to the `NodePort`, which then routes to the matching Pods via the Service.

> _(See Image: LoadBalancer Service flow in cloud setup — `image_loadbalancer_service_flow.png`)_

This means external clients can connect using:

```
http://<external-ip>:<port>
```

And Kubernetes will ensure that requests are routed to the correct Pod, through a fully managed path.

#### 3.3.3 LoadBalancer YAML Example

Here's a sample definition for a `LoadBalancer` Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: inference-api
spec:
  selector:
    app: inference
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80           # External port exposed by the load balancer
      targetPort: 5000   # Port inside the Pod (e.g., Flask app)
```

Once applied:

- Your cloud provider will provision a load balancer.
- The Service will be assigned a **public IP address**.
- Requests to that IP on port `80` will reach your app running on port `5000`.

You can retrieve the external IP using:

```bash
kubectl get service inference-api
```

Output:

```
NAME            TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)
inference-api   LoadBalancer   10.0.0.52      34.120.83.23    80:30765/TCP
```

Now you (or anyone) can access your app at `http://34.120.83.23`.

#### 3.3.4 When to Use LoadBalancer

Use `LoadBalancer` when:

- You're running your Kubernetes cluster on a **cloud provider**
- You want **automated, secure exposure** of your app to the internet
- You don't want to manage ingress routing or node IPs manually

!!! tip
    `LoadBalancer` Services are perfect for early production setups or APIs where simplicity is important and traffic levels are moderate.

#### 3.3.5 Limitations to Consider

While `LoadBalancer` is convenient, it has a few limitations:

- You get **one cloud load balancer per Service**, which may be **expensive**
- It only supports **Layer 4 (TCP/UDP)** routing
- For more advanced traffic control (e.g., path-based routing, SSL termination), you'll want to use an **Ingress Controller**

### 3.4 ExternalName

An `ExternalName` Service lets you map a Service name inside your Kubernetes cluster to an **external DNS name**. It doesn't define a selector, doesn't create endpoints, and doesn't route traffic like other Service types.

Instead, it acts as a **pure DNS alias**.

#### 3.4.1 Why Use ExternalName?

Consider this scenario: your application running in Kubernetes needs to talk to an **external database**, or maybe a legacy service running outside the cluster. Hardcoding URLs across Pods or deployments is not ideal — you want a clean, central way to reference it.

With an `ExternalName` Service, you can:

- Use a **Kubernetes-native DNS name** (e.g., `db-service.default.svc.cluster.local`)
- Redirect that name to an **external fully qualified domain name (FQDN)** (e.g., `mysql.prod.example.com`)
- Keep the rest of your application unaware of where the actual service lives

#### 3.4.2 How It Works

When a Pod makes a request to an `ExternalName` Service, Kubernetes' internal DNS server **returns a CNAME record** pointing to the external hostname.

There is **no proxying or routing** — Kubernetes simply instructs the Pod to resolve the external hostname directly.

> _(See Image: ExternalName DNS alias resolution — `image_externalname_dns_flow.png`)_

#### 3.4.3 YAML Definition of an ExternalName Service

Here's an example where a Kubernetes Service named `db-service` maps to an external MySQL database:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: db-service
spec:
  type: ExternalName
  externalName: mysql.prod.example.com
```

With this, any Pod in the same namespace can connect to:

```
db-service.default.svc.cluster.local
```

And it will resolve to:

```
mysql.prod.example.com
```

This indirection makes it easier to **change external endpoints** later without modifying client code or redeploying applications.

#### 3.4.4 When to Use ExternalName

Use `ExternalName` when:

- You want to reference **external services via Kubernetes-native DNS**
- You're integrating with **third-party APIs**, legacy databases, or cloud-hosted services
- You need a lightweight way to **decouple service names** from external endpoints

!!! note
    An `ExternalName` Service doesn't support port mapping, selectors, or health checks. It's purely a DNS-level redirection mechanism.

### 3.5 Headless Services

A **Headless Service** is a Service that **does not get assigned a ClusterIP**. Instead of providing a stable virtual IP, it **exposes the individual Pod IPs directly** to the client. This allows clients to discover and interact with **each Pod individually**, rather than through a load-balanced virtual IP.

In short, a Headless Service:

- Has **no ClusterIP**
- Skips the kube-proxy load balancing
- Directly returns the list of **Pod IPs** in DNS responses

This gives the client full control over how it uses the discovered endpoints.

#### 3.5.1 Why Use Headless Services?

Headless Services are useful in scenarios where:

- You need **direct access to each Pod**, not a load-balanced endpoint
- Your application has **stateful or peer-aware components**, such as:
    - Databases like Cassandra or StatefulSets
    - Distributed caches
    - Custom service discovery protocols
- You want to **control client-side load balancing** (e.g., through a smart client library)

They are commonly used in conjunction with **StatefulSets**, where each Pod has a stable network identity and storage.

#### 3.5.2 YAML Definition of a Headless Service

Here's how you define a Headless Service — note the `clusterIP: None` field:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: db-headless
spec:
  clusterIP: None          # Marks this as a Headless Service
  selector:
    app: cassandra
  ports:
    - port: 9042           # Typical Cassandra port
```

With this setup, Kubernetes will **not assign a virtual IP** to the Service. Instead, a DNS query for `db-headless` will return **multiple A records**, one for each Pod matching the selector.

If the Pods belong to a StatefulSet, you can even resolve individual Pod hostnames like:

```
cassandra-0.db-headless.default.svc.cluster.local
cassandra-1.db-headless.default.svc.cluster.local
```

> _(See Image: Headless Service DNS resolution to Pod IPs — `image_headless_service_dns.png`)_

This is crucial for systems where each Pod plays a unique role or must be contacted directly.

#### 3.5.3 When to Use Headless Services

Use a Headless Service when:

- You're running **stateful workloads** that require identity (e.g., databases, message brokers)
- You want **client-side control** over how traffic is distributed
- You're using **custom service discovery mechanisms**
- You need to access each **Pod individually**, not through a single virtual IP

!!! info
    Kubernetes injects the Service's DNS name into every Pod's DNS resolver by default, enabling automatic discovery.

### 3.6 Summary: Types of Kubernetes Services

Services in Kubernetes are essential for enabling **reliable communication between Pods** and for **exposing applications** inside and outside the cluster. Since Pods are ephemeral and their IP addresses can change frequently, Services provide the **stable networking abstraction** that Kubernetes workloads need.

Here's a recap of the different types of Services and when to use them:

#### 1. **ClusterIP** (default)

- **Scope**: Internal to the cluster
- **Use case**: Service-to-service communication within Kubernetes (e.g., frontend ↔ backend)
- **Features**:
    - Provides a stable virtual IP and DNS name
    - Load balances traffic across matching Pods
- **Recommended when**: You want private communication between Pods without external exposure

#### 2. **NodePort**

- **Scope**: External access via node IPs and static ports
- **Use case**: Exposing applications during development or for basic external access
- **Features**:
    - Opens the same port on every node in the cluster
    - Accessible via `<NodeIP>:<NodePort>`
- **Recommended when**: You need external access but don't have a cloud load balancer

#### 3. **LoadBalancer**

- **Scope**: Public internet access via cloud provider-managed load balancer
- **Use case**: Production workloads that need to be accessed over the internet
- **Features**:
    - Automatically provisions an external IP and routes traffic through a cloud load balancer
- **Recommended when**: You're on a cloud platform and want easy, managed external access

#### 4. **ExternalName**

- **Scope**: DNS-level redirection to external services
- **Use case**: Connecting to databases or APIs outside the cluster
- **Features**:
    - Returns a DNS CNAME record instead of routing traffic
    - No Pods, ports, or selectors involved
- **Recommended when**: You want to reference external services in a Kubernetes-native way

#### 5. **Headless Service**

- **Scope**: Pod-level service discovery without a virtual IP
- **Use case**: Stateful or peer-aware systems (e.g., Cassandra, Kafka, custom clients)
- **Features**:
    - Skips IP allocation and kube-proxy
    - DNS resolves directly to individual Pod IPs
- **Recommended when**: You need clients to be aware of and communicate with individual Pods directly

Each type of Service provides a different trade-off between **visibility**, **routing**, and **control**. Choosing the right one depends on **how and where your application needs to be accessed**, and **what kind of traffic control and identity** your workload requires.

## 4 Creating and Using Services

Let's now walk through how to **define, apply, and use Services** in a Kubernetes cluster — with a focus on Service YAML structure, exposing Deployments, and how DNS-based service discovery works in practice.

### 4.1 YAML Structure for a Service

All Services in Kubernetes follow a similar base structure in YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: <service-name>
spec:
  selector:
    <label-key>: <label-value>
  ports:
    - protocol: TCP
      port: <service-port>
      targetPort: <container-port>
  type: <ServiceType>  # ClusterIP | NodePort | LoadBalancer | etc.
```

- `selector`: Specifies which Pods this Service routes to, based on labels.
- `ports`: Defines the port exposed by the Service (`port`) and the corresponding container port (`targetPort`).
- `type`: Determines how the Service behaves (e.g., `ClusterIP`, `NodePort`, etc.).

!!! note
    If no `type` is specified, `ClusterIP` is used by default.

### 4.2 Exposing a Deployment with a Service

Let's look at a concrete example: suppose we have a `backend` Deployment running a Flask app on port `5000`. To expose this Deployment inside the cluster, we create a `ClusterIP` Service as follows:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend               # This must match labels on Pods
  ports:
    - port: 80                 # Port to expose within the cluster
      targetPort: 5000         # Port used by the backend container
  type: ClusterIP
```

You can apply it with:

```bash
kubectl apply -f backend-service.yaml
```

Now, any Pod in the cluster can talk to the backend using:

```
http://backend-service
```

Or its full DNS name:

```
http://backend-service.default.svc.cluster.local
```

!!! info
    Kubernetes injects the Service's DNS name into every Pod's DNS resolver by default, enabling automatic discovery.

### 4.3 Service Discovery in Action (via DNS)

Kubernetes includes an internal **DNS add-on** (usually CoreDNS) that automatically registers DNS names for every Service. This enables other Pods to discover and connect to services without needing to know IP addresses.

For example:

- A Service named `api` in the `default` namespace will have the DNS name:
    
    ```
    api.default.svc.cluster.local
    ```
    
- If your Pod is in the same namespace, you can omit the rest:
    
    ```
    http://api
    ```

Behind the scenes:

- DNS resolves the Service name to the ClusterIP (for `ClusterIP`, `NodePort`, `LoadBalancer`)
    
- Or directly to Pod IPs (for `Headless Services`)
    
- kube-proxy or client handles routing to the actual backend container
    

> _(See Image: Service discovery and DNS resolution in Kubernetes — `image_service_dns_resolution.png`)_

### 4.4 Verifying a Service

You can inspect your Service and verify it's routing correctly using:

```bash
kubectl get service backend-service
kubectl describe service backend-service
```

And if you want to check which Pods are matched by the selector:

```bash
kubectl get endpoints backend-service
```

This confirms the link between the Service and the Pods via the label selector.

## 5 Common Scenarios for Kubernetes Services

Kubernetes Services are not just a networking abstraction — they are fundamental to building reliable, modular, and scalable systems. Let's look at how they are commonly used in different real-world setups.

### 5.1 Internal Service Communication (Microservices)

One of the most common use cases is enabling **internal communication between microservices**. In a typical Kubernetes application, you might have:

- A `frontend` service (React, Angular, etc.)
- A `backend` service (Flask, FastAPI, Node.js)
- A `database` Pod running inside the cluster
- An `auth` service or `recommendation` engine

Each of these services runs in its own Pod(s), and each one needs to talk to others without relying on fixed IPs or manual configuration.

Using `ClusterIP` Services:

- Each component gets a stable name (e.g., `auth-service`)
- Internal traffic is routed via DNS and load balanced across replicas
- The system becomes resilient to Pod churn and scaling changes

!!! example
    The `frontend` can call the `backend` using `http://backend-service`, and the backend can query `auth-service` for user validation, all through internal DNS-based routing.

This is the **foundation of microservice communication** in Kubernetes.

### 5.2 Exposing a Machine Learning Model for Inference

Data scientists often need to deploy trained models for real-time inference. A common pattern is to:

1. Package the model inside a container (e.g., with Flask or FastAPI)
2. Deploy it as a Pod or Deployment
3. Expose it using a `Service` for consistent access

There are two typical Service types used here:

- **ClusterIP**: When the model is accessed only by internal services like a data pipeline or an orchestrator.
- **LoadBalancer** or **Ingress**: When the model needs to be exposed to external clients or integrated with frontend applications.
    

```yaml
apiVersion: v1
kind: Service
metadata:
  name: fraud-model-service
spec:
  selector:
    app: fraud-detector
  ports:
    - port: 80
      targetPort: 8501   # TensorFlow Serving or FastAPI
  type: ClusterIP         # Use LoadBalancer if external access is needed
```

!!! tip
    Services decouple model consumers from model replicas. You can retrain and roll out a new version without affecting the inference clients, as long as the Service name stays the same.

### 5.3 Accessing External Databases via Services

In many enterprise environments, not all components live inside the Kubernetes cluster. For example, your database might still be hosted:

- On a managed cloud database (e.g., AWS RDS, Azure SQL)
- In a legacy on-prem server
- As a shared service used by multiple applications

To make this resource accessible inside Kubernetes, you can use an **ExternalName** Service. This allows Pods to connect to an external database using a Kubernetes-native DNS name.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: orders-db
spec:
  type: ExternalName
  externalName: orders-db.production.company.net
```

Now, inside any Pod, the application can connect to:

```
orders-db.default.svc.cluster.local
```

And Kubernetes will redirect that DNS lookup to `orders-db.production.company.net`.

!!! note
    This makes it easy to update or migrate the external database endpoint later — without touching application code.

These scenarios highlight the **flexibility and power of Kubernetes Services**. Whether you're wiring together microservices, serving ML models, or bridging to systems outside the cluster, Services provide the abstraction that lets your applications remain stable, portable, and scalable.

