
Why do we need kubernetes since we have docker.

for understanding this we will take two scenario for each a small scale and large scale application.

The setup we have is one small scale application and one large scale application.

![[small_large_application.png]]


Scenario : Small Application

What happens when some containers in application fails?
The admin/develper will do SSH into the vm and will fix the container which is down.

Scenario will look like this:
![[small_application_conatiner_fail.png]]



Scenario : Large Application (lakhs of containers)

What happens when some containers in application fails?

option of doing SSL here is also an option but do you think it is a viable option, when there are so much containers. Since failure of container is common, it will become tidious to mamange these container. 

Systme will look like:

![[large_application_container_fail.png]]

This rises the need to have a sustyem that will solves the following issues faced:
- Scalability
- High avaliability
- fault tolerance
- management
- orchestration.

These all problems are solved by Kubernetes.
With this we are clear why we need to learn kubernetes. (Explain the above in detail.) 

Next we will start learnig everything in detail.





---
---

What is Pod?

Pod is smallest deployable unit in kubernetes. 
![[diagram-export-6-1-2025-11_10_59-PM.png]]

Inside a pod there can be one or more containers. Concepts like helper container, init container

Discuss the scenarios where we need multicontainers inside a pod.(container to fro the application monitoring running on the pod)

Discuss in detail.


There are two ways of creating pods.
- imperitive way
- declarative way
(Explain both types in detail with sample yamls files , commands and examples )

whenever we run kubectl command it hits the restAPI to the kubernetes cluster.

Explain this in very detail


---
---

Kubernetes Architecture

In the architecture we have two main component:
1. Control Plane/ Master Node
2. Worker Node

Control Plane/ Master Node
- API Server - Also knows as brain of kubernetes cluster. It is the entry point to the cluster.
- Schedular/kube schedular - It keeps on watching the pods that are waiting to be assigned to a node
- Controller manager - It is a set of one or more controller. It has multiple controller. It makes sure that the application is always up and running. e.g., deployment controller, namespace comtroller, node controller.
- ETCD - It is key store database. Everything about the cluster is stored in it. Current state of the cluster, all the configuration of the cluster, all the running pods ,all the stopped pods. When ever API call enters to the cluster it makes can entry in the database. like logging the api call in db along which every single detail is stored. lets we hit a command kubectl get pods . from where we wilkl get inforfmation of all running pods. we will get it from the ETCD .
- Cloud controller manager - this component will be there only in case of managed cloud service. what it will do, it will receive the request from the api server and forward to the CLoud provider. after this entry will be created in the ETCD

These all components don not interact directly with each other. these components interact with each other via API server.
![[diagram-export-6-2-2025-1_09_55-AM.png]]
PLease explain this is very detail. INclude every detail.

Next we will discuss worker node.

Worker Node

![[diagram-export-6-2-2025-1_40_37-AM.png]]

Compleete Atrchitecture

![[diagram-export-6-2-2025-1_42_30-AM.png]]



---
---
Deploy a Simpel Pod.

kubectl logs -f pod_name

kubectl describe pod pod_name
kubectl describe pod/pod_name
	Events:

Creating pod.yaml
- There are 4 top level fileds in yaml
	- apiVersion
	- Kind
	- metadata
	- spec

kubectl get pods
kubectl get pods -o wide


kubectl get pod nginx-pod -o yaml
kubectl get pod nginx-pod -o json

pod.yaml
```yaml
apiVersion: v1
Kind: pod
metadata:
  name: my_pod
  labels:
    env: dev
spec:
  containers:
    name:my_container
    image: nginx:latest
```

now to spin up a pod with the above  yaml file we nned to executye the command:
kubectl create -f pod.yaml

if we run the command 
```
kubectl run --image=nginx --dry-run=client
```

This command will just run in dry run mode. It will not spin up the pod. 

We can also use this command to extarct the yaml also along nopt creating the pod at the executiopn time of the copmmand

```
kubectl run --image=nginx --dry-run=client -o yaml > pod1.yaml
```

on applying cat pod1.yaml we can view the yaml file created.


Now if we want to make chganges to these running pods, there are various methods to do so.
- kubectl edit pod pod_name      -   It will the VI editor we can make changes and save. These changes should be applied. To chekc that we have various ways like kubectl describe pod pad_name, and other ways. (mentionn those)
- other way is we can direct open the yaml file in vi editor and amek changes there and save. After this we have to run a command  - kubectl apply -f pod1.yaml
We can use apply command even for creatuing the new resource. This is commanoly what is used in industry.


Now to execute command inside the pod we use the command:
- kubectl exec -it pod_name --bash        - This open rthe bash terminal in the pods and will naviagte us to that terminal. 
- on executing the exit command we will come out of the pod bash terminal.

Please explain all of the above in detail. explain every concept in detail and ion continuation. Goup the concepts I might have the outline here and there for this section. Create a flow and generate the comtent arouinf that. dont use emojis. Explain in detail. 



---
---

Why do we need deployment? what is need of this? 


1. **Core Concepts of Deployment**

- What is a Deployment?
    
- Difference between Pod, ReplicaSet, and Deployment
    
- Deployment YAML structure and key fields
    
- Labels and Selectors
    

---

2. **Creating and Managing Deployments**

- Creating a Deployment using YAML and `kubectl`
    
- Inspecting Deployments: `kubectl get`, `describe`, and `logs`
    
- Editing Deployments: `kubectl edit` vs reapplying YAML
    
- Deleting Deployments
    

---

 3. **Replica Management**

- Setting and updating `replicas` count
    
- Scaling manually using `kubectl scale`
    
- Horizontal Pod Autoscaler (intro)
    

---

4. **Rolling Updates and Rollbacks**

- Strategy types: `RollingUpdate` and `Recreate`
    
- Update parameters: `maxUnavailable`, `maxSurge`
    
- Performing and monitoring rolling updates
    
- Rollbacks: when and how to use `kubectl rollout undo`
    
- Viewing deployment history and revisions


These are the topics that we have to cover in deployment.
Dont generate content. just have thios for you refernce and i will provide you one by one, then only generate the content around that. Explain in very detail . dont use emojis. generated professional contyent from reader in a continuation flow. USe examples analogies where required to expalin in detail.