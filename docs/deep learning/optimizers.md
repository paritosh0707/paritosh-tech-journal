
## **Introduction to Optimizers in Deep Learning**

In the journey of building effective deep learning models, training is often where the real challenge begins. Once we’ve designed an architecture and chosen an appropriate loss function, the next step is to iteratively improve our model’s parameters—its weights and biases—so it can learn meaningful patterns from the data. But how exactly do we update these parameters efficiently?

This is where **optimizers** come in. Their role is pivotal. Optimizers are algorithms or methods used to **minimize (or maximize) a loss function by updating the model’s parameters** during training. In essence, they guide the model toward better performance, one step at a time, using feedback from the loss function.

As deep learning models grow in complexity and size, training them becomes not just a matter of mathematical correctness but also computational efficiency. Optimizers, alongside techniques like **weight initialization** and **batch normalization**, have become central to **speeding up the training process**, reducing the number of epochs required to converge, and stabilizing learning behavior.

To understand the value of an optimizer, consider this: no matter how elegant your neural network architecture is, poor optimization can trap it in suboptimal local minima or slow down learning to a crawl. Conversely, a well-chosen optimizer can unlock the full potential of your model by navigating the loss landscape intelligently.

In this chapter, we’ll walk through the conceptual underpinnings of optimizers, examine why they matter, and progressively build an understanding of different optimization techniques—from the classical ones to those designed for modern deep learning systems. Let’s begin by grounding ourselves in the most fundamental optimization technique of all: **Gradient Descent**.

---

## **The Role of Optimizers in a Neural Network**

To appreciate the importance of optimizers, we first need to understand what a neural network really does under the hood. At its core, a neural network is a **parameterized function**—its parameters being the **weights and biases** spread across its layers. These parameters define how input data flows through the network and ultimately determines the predictions the model makes.

However, a freshly initialized neural network knows nothing about the task at hand. Its initial predictions are random, stemming from weights and biases that were, by design, randomly assigned. This brings us to the essential problem: **how do we tune these parameters so that the model's predictions become meaningful?**

The answer lies in optimization. The **goal of training** a neural network is to **find the optimal values** for its parameters so that its predictions closely match the actual target values. This notion of "closeness" is mathematically captured by a **loss function**—a measure of how far the model’s predictions are from the ground truth. The **lower** the loss, the **better** the model is performing.

But here’s the catch: the **loss function is itself a function of the model parameters**. That is, the value of the loss depends on the current weights and biases. To minimize the loss, we need to find the right combination of parameter values that lead to the smallest possible loss.

This gives rise to a compelling visualization—imagine the loss function as a **landscape**, where each point on the surface represents a particular configuration of model parameters and the height at that point indicates the corresponding loss. In a simple case with only two parameters, we could plot this as a **3D surface** with valleys (low loss) and peaks (high loss). In reality, neural networks involve **millions of parameters**, so this landscape exists in a very high-dimensional space. Nevertheless, the intuition remains: **our job is to descend this landscape to reach the bottom—a point of minimal loss.**

However, we don’t know this landscape ahead of time, nor do we know where the valleys are. We must **navigate it blindly**, starting from some random point and taking small steps based on the slope of the terrain around us.

This is precisely the role of an **optimizer**. It provides the **strategy for updating the parameters** based on the current slope of the loss surface (i.e., gradients), helping the model gradually move toward better performance. Without an optimizer, the model has no direction, no guide—just a vast parameter space and no way to improve.

In the next section, we’ll begin our exploration of optimization techniques by introducing the simplest and most foundational one—**Gradient Descent**—which serves as the building block for nearly all modern optimizers.

---

## **Gradient Descent: The Foundational Optimizer**

Now that we understand the need for an optimizer to navigate the loss landscape, let’s begin with the most fundamental technique in the deep learning toolkit: **Gradient Descent**. Despite the simplicity of its mechanics, Gradient Descent lies at the heart of nearly every modern optimization algorithm used in deep learning.

At its core, Gradient Descent is built on a powerful idea from calculus: **to minimize a function, follow the direction of steepest descent**. In our case, the function we aim to minimize is the **loss function**, and the parameters we want to update—our weights and biases—sit on a high-dimensional surface defined by this function.

### The Update Rule

Gradient Descent proposes a simple iterative rule for updating each parameter:

$$\theta_{\text{new}} = \theta_{\text{old}} - \eta \cdot \nabla_{\theta} \mathcal{L}(\theta)$$

Where:

- $\theta$ represents a model parameter (e.g., a weight),
    
- $\eta$ is the **learning rate**, a small positive constant,
    
- $\nabla_{\theta} \mathcal{L}(\theta)$ is the **gradient of the loss function** with respect to $\theta$,
    
- The minus sign ensures we move **in the direction that reduces the loss**.
    

This update rule is deceptively simple. At every step (or iteration), we calculate the **gradient**—the slope of the loss surface at our current parameter values—and take a step in the **opposite direction** of this slope. Intuitively, if you’re standing on a hill and want to reach the valley, you walk downhill—that is, in the direction of the negative gradient.

### Iterative Process Over Epochs

This isn’t a one-time computation. The update rule is applied **repeatedly over multiple epochs**—each epoch representing a full pass over the training data. With each iteration, the parameters ideally move closer to values that minimize the loss function.

### Behavior Across the Loss Landscape

One elegant feature of Gradient Descent is its **adaptive step sizes** based on the geometry of the loss surface:

- **Far from the minimum**, the gradient is typically large, resulting in **larger parameter updates**—which helps the model make quick progress early in training.
    
- **Near the minimum**, the gradient becomes smaller, leading to **smaller, finer updates**—allowing the model to converge more carefully without overshooting.
    

This dynamic behavior contributes to the efficiency and stability of Gradient Descent. However, despite its foundational importance, vanilla Gradient Descent is not without challenges. It struggles with complex loss surfaces—especially those with **ravines, saddle points, or local minima**. Additionally, it requires computing gradients over the **entire training dataset** before making an update, which can be computationally expensive.

These limitations led to the development of more practical variants of Gradient Descent, such as **Stochastic Gradient Descent (SGD)** and **Mini-Batch Gradient Descent**, which we’ll explore next.

---

## **Types of Gradient Descent (A Quick Recap)**

Before we move on to more advanced optimization techniques, it's helpful to quickly revisit the **variants of Gradient Descent**, as their behavior lays the groundwork for understanding later improvements.

While the **update rule** remains the same across all types of Gradient Descent, what differentiates them is **how much data is processed before each parameter update**:

- **Batch Gradient Descent**: This is the classic form. It computes the gradient using the **entire training dataset** before performing a single update. While this approach ensures a stable and accurate gradient, it becomes **computationally expensive** for large datasets and slows down learning.
    
- **Stochastic Gradient Descent (SGD)**: On the opposite end of the spectrum, SGD updates the model **after every single data point**. This makes it **highly efficient and quick to learn**, but the updates are noisy and may cause the loss to fluctuate during training.
    
- **Mini-Batch Gradient Descent**: This strikes a balance between the two extremes. Instead of processing the full dataset or a single sample, it updates the weights after processing **a small batch of samples** (typically 32, 64, or 128). This provides a **good trade-off between computational efficiency and gradient stability**, and is the most widely used variant in modern deep learning workflows.
    

These variants are conceptually simple yet practically impactful. They lay the foundation upon which **adaptive optimizers** such as Momentum, RMSprop, and Adam build—by enhancing how gradients are used or remembered during training. Let’s now move beyond these basic techniques and see how optimization can be further accelerated.

---

## **Challenges and Problems with Conventional Gradient Descent**

Although Gradient Descent forms the cornerstone of neural network optimization, it often struggles in practice, especially in large-scale, high-dimensional deep learning scenarios. These practical shortcomings have driven the development of more advanced and adaptive optimizers. Before we explore those, it’s important to understand **why conventional Gradient Descent falls short** and where it tends to break down.

### **Problem 1: Difficulty Setting the Correct Learning Rate**

One of the most sensitive aspects of the gradient descent algorithm is the **learning rate**—the hyperparameter that determines the size of each update step.

If the learning rate is **too small**, the model will inch forward slowly across the loss landscape, requiring many iterations and consuming excessive time to converge.

Conversely, if the learning rate is **too large**, the model might **overshoot the minimum**, causing it to bounce around or even diverge altogether, leading to **unstable training**.

This makes finding the “just right” learning rate an art in itself—one that’s often **dataset-dependent and model-specific**. Small changes in the problem space may require re-tuning this hyperparameter from scratch.

> **Related idea – Learning Rate Scheduling:**  
> A common workaround is **learning rate scheduling**, where the learning rate is gradually decreased over time according to a predefined schedule. While helpful, this approach introduces its own assumptions: it doesn’t **adapt dynamically** based on how the optimization is going and may not generalize well across different datasets or training scenarios.

### **Problem 2: Using the Same Learning Rate for All Parameters**

In standard Gradient Descent, **every parameter**—whether it's in the first layer or the last—receives updates scaled by the **same global learning rate**. But not all parameters learn at the same pace.

In reality, different regions of the loss landscape can vary significantly:

- Some directions may be **steep**, requiring small steps to avoid overshooting.
    
- Others may be **flat**, demanding larger steps to make progress.
    

Using the **same learning rate uniformly** across all dimensions ignores these differences and can lead to **inefficient learning**—some weights stagnate while others oscillate or diverge.

### **Problem 3: Getting Stuck in Local Minima**

Neural networks often operate in **non-convex** loss landscapes filled with **local minima**—points where the loss is lower than surrounding regions, but not the absolute lowest.

Standard Gradient Descent may converge to such a local minimum and get **stuck**, especially if the gradients in the surrounding area do not provide enough directional change to escape.

While **Stochastic Gradient Descent** (SGD) introduces some randomness into updates, offering occasional opportunities to escape these traps, it’s not a guaranteed solution—especially in high-dimensional settings where flat regions abound.

### **Problem 4: The Problem of Saddle Points**

Saddle points pose an even more subtle challenge. A **saddle point** is a location in the loss surface where the gradient is near zero in all directions, but the point is **neither a local minimum nor a maximum**. It may be a valley in one direction and a peak in another.

In such regions, conventional Gradient Descent **misinterprets the vanishing gradient** as a sign of having reached a minimum. As a result, it may **stop updating** or move extremely slowly—despite the fact that better solutions lie beyond.

Saddle points are especially common in **high-dimensional parameter spaces**, making them a pervasive issue in deep learning. Since the update rule relies entirely on the gradient’s direction and magnitude, Gradient Descent can stagnate at these deceptive points.

---

## **The Need for Advanced Optimizers**

As we've seen, while conventional Gradient Descent provides a foundational approach to training neural networks, it suffers from several critical limitations in real-world settings—ranging from the difficulty of setting an effective learning rate, to uniform updates across all parameters, and the inability to reliably escape local minima and saddle points.

These challenges don’t just slow down learning—they can stall it altogether or lead the model toward suboptimal solutions.

This is precisely why **advanced optimizers** are necessary. Rather than reinventing the wheel, most of these optimizers are **built on top of the basic Gradient Descent algorithm**, introducing subtle yet powerful enhancements:

- Some adapt the learning rate **individually per parameter**.
    
- Others introduce **momentum** to help navigate valleys and escape flat regions.
    
- Many accumulate **historical gradient information** to better guide each update.
    

These improvements transform a simple optimizer into a far more **robust and responsive learning mechanism** that can handle the complexities of deep learning in practice.

In the upcoming sections, we'll explore some of the most influential optimizers—starting with **Momentum**, and moving on to **RMSprop** and **Adam**, which combine multiple ideas into state-of-the-art performance for training deep neural networks.

---

## **Advanced Optimizers to Be Covered**

Now that we've understood why standard Gradient Descent often falls short, it’s time to look at the **family of advanced optimizers** that have been developed to address these limitations. These optimizers build upon the same fundamental idea—using gradients to improve the model—but they add **intelligent refinements** that make training faster, more stable, and more effective across a wide variety of tasks.

Each of the optimizers we’ll cover in the upcoming sections brings its own unique strengths to the table, often by solving one or more of the specific problems we encountered earlier:

- **Momentum** introduces a memory of past gradients to smooth the optimization path and avoid zig-zagging.
    
- **Nesterov Accelerated Gradient** takes Momentum a step further by anticipating future positions, leading to more informed updates.
    
- **Adagrad** adapts the learning rate per parameter based on historical gradients, making it suitable for sparse data problems.
    
- **RMSprop** improves upon Adagrad by controlling how much past gradient information is retained, enabling it to perform well on non-stationary objectives.
    
- **Adam**, arguably the most popular optimizer in deep learning today, combines the best ideas from both Momentum and RMSprop into a single, adaptive, and efficient optimization algorithm.
    

In the following sections, we’ll walk through each of these optimizers—starting with **Momentum**—to understand how they work, what problems they solve, and how to use them effectively in Python-based deep learning workflows.

---

## **Exponentially Weighted Moving Average (EWMA): A Foundational Concept**

As we continue our exploration of deep learning optimizers, there’s one crucial idea we need to understand before diving deeper. This concept forms the mathematical backbone of several powerful optimization techniques—including Momentum, RMSprop, and Adam. It's called the **Exponentially Weighted Moving Average (EWMA)**, sometimes also referred to as the **Exponential Moving Average (EMA)**.

Although EWMA originates in fields like **time series analysis**, **forecasting**, and **signal processing**, it plays a surprisingly central role in how we train modern neural networks. Let’s build an intuitive understanding of it first.

### **Why EWMA? Understanding the Trend Beneath the Noise**

Imagine tracking daily temperatures over a month. Each day's temperature might fluctuate due to local weather patterns, but overall, you might notice a seasonal trend—perhaps it's gradually getting warmer. That **underlying trend** is what EWMA helps us extract from noisy, fluctuating data.

EWMA gives **more importance to recent values** and gradually reduces the influence of older ones. This creates a **smoother curve** that filters out short-term variations and highlights the long-term pattern. For instance, in a graph of daily temperatures, the original data (in blue) might show sharp ups and downs, while the EWMA (in black) would appear as a smooth curve capturing the overall progression.

### **The Formula and Intuition**

Mathematically, the EWMA at time tt, denoted vtv_t, is calculated as:

vt=β⋅vt−1+(1−β)⋅xtv_t = \beta \cdot v_{t-1} + (1 - \beta) \cdot x_t

Where:

- xtx_t is the new data point (e.g., today's temperature or gradient),
    
- vt−1v_{t-1} is the previous moving average,
    
- β\beta is a smoothing parameter between 0 and 1 (e.g., 0.9 or 0.99).
    

The key idea is that:

- A **larger β\beta** (closer to 1) puts **more emphasis on older data**—resulting in **smoother but slower-to-react** curves.
    
- A **smaller β\beta** emphasizes **newer data more**—producing **quicker but more jittery** reactions.
    

This mechanism is not just for temperature or stock prices. It’s used in **company revenue predictions**, **sensor signal filtering**, and—most relevant to us—**gradient tracking in deep learning**.

### **Why EWMA Matters in Deep Learning**

In deep learning, especially when training large models, gradients can be noisy—changing sharply from one iteration to the next. Simply following the raw gradient at each step can lead to **jittery or unstable learning**. EWMA provides a way to **smooth out these updates**, helping the model follow a more consistent trajectory toward the optimum.

This is the exact principle behind the **Momentum optimizer**, which we'll explore next. Momentum uses EWMA to retain a “memory” of past gradients, so the model doesn’t get distracted by noisy or contradictory directions.

In short, EWMA gives us a way to move more intelligently—**not just reacting to the latest input, but learning from a weighted history of the journey so far**.

---

### **Core Principles of EWMA**

Now that we’ve introduced the concept of Exponentially Weighted Moving Average (EWMA), let’s pause and highlight its two **core principles**. Despite its wide applicability and deep utility in optimizers, EWMA remains **remarkably simple** in how it functions. Understanding these two key ideas will make it easier to grasp how optimizers like Momentum and Adam build upon this foundation.

#### **1. Newer Values Are Given More Weight**

In EWMA, **recent data points influence the average more heavily than older ones**. This is a defining characteristic of the method.

For example, if we’re averaging daily temperatures, the temperature on **Day 3 will have more impact** on the current moving average than the temperature on **Day 1**. The underlying logic is that **newer data reflects more recent trends**, which we typically care about more in both forecasting and optimization contexts.

This property is encoded directly in the formula:

vt=β⋅vt−1+(1−β)⋅xtv_t = \beta \cdot v_{t-1} + (1 - \beta) \cdot x_t

Here, the term (1−β)⋅xt(1 - \beta) \cdot x_t ensures that the **current value xtx_t** gets a higher weight than the older average vt−1v_{t-1}, especially when β\beta is close to 1.

#### **2. The Influence of Any Individual Point Fades Over Time**

As more data points are processed, the **weight of any single data point decreases exponentially**. While every past observation continues to contribute to the moving average in some small way, its impact **shrinks with time**.

This fading memory effect allows EWMA to be **both stable and responsive**:

- Stable, because it retains historical context.
    
- Responsive, because it adjusts quickly to new trends, especially if the recent values start changing sharply.
    

Together, these two principles enable EWMA to maintain a **balanced view of the past and the present**, which is exactly what deep learning optimizers need when navigating complex, noisy loss surfaces.

---

### **Mathematical Formula and Step-by-Step Calculation**

Now that we’ve understood the intuition behind the Exponentially Weighted Moving Average (EWMA), let’s translate that understanding into concrete computations. This not only reinforces the concept but also prepares us to see **how EWMA is used within deep learning optimizers**, where gradients change with each training iteration.

The formula for EWMA is:

Vt=β⋅Vt−1+(1−β)⋅TtV_t = \beta \cdot V_{t-1} + (1 - \beta) \cdot T_t

Where:

- VtV_t: EWMA at time step tt,
    
- Vt−1V_{t-1}: EWMA at the previous time step,
    
- TtT_t: New data point at time tt (e.g., temperature, gradient, etc.),
    
- β\beta: Smoothing factor or decay rate, with 0≤β≤10 \leq \beta \leq 1.
    

Let’s walk through this with an example.

---

#### **Step-by-Step Calculation: A Simple Temperature Dataset**

Suppose we are tracking daily temperatures, and we have the following data points:

|Day|Temperature (TtT_t)|
|---|---|
|1|30°C|
|2|32°C|
|3|31°C|
|4|35°C|
|5|33°C|

Let’s compute the EWMA for this dataset using β=0.9\beta = 0.9, a typical value used in deep learning applications. But before we begin, we need to decide on an **initial value** V0V_0.

#### **Choosing the Initial Value V0V_0**

There’s no strict rule for choosing V0V_0, and in practice:

- Some approaches set V0=0V_0 = 0,
    
- Others initialize V0=T0V_0 = T_0, i.e., the first data point.
    

For smoother and more intuitive convergence, we’ll **set V0=T1=30°CV_0 = T_1 = 30°C**.

---

#### **Compute V1V_1**

V1=0.9⋅V0+0.1⋅T2=0.9⋅30+0.1⋅32=27+3.2=30.2V_1 = 0.9 \cdot V_0 + 0.1 \cdot T_2 = 0.9 \cdot 30 + 0.1 \cdot 32 = 27 + 3.2 = 30.2

#### **Compute V2V_2**

V2=0.9⋅V1+0.1⋅T3=0.9⋅30.2+0.1⋅31=27.18+3.1=30.28V_2 = 0.9 \cdot V_1 + 0.1 \cdot T_3 = 0.9 \cdot 30.2 + 0.1 \cdot 31 = 27.18 + 3.1 = 30.28

#### **Compute V3V_3**

V3=0.9⋅V2+0.1⋅T4=0.9⋅30.28+0.1⋅35=27.252+3.5=30.752V_3 = 0.9 \cdot V_2 + 0.1 \cdot T_4 = 0.9 \cdot 30.28 + 0.1 \cdot 35 = 27.252 + 3.5 = 30.752

#### **Compute V4V_4**

V4=0.9⋅V3+0.1⋅T5=0.9⋅30.752+0.1⋅33=27.6768+3.3=30.9768V_4 = 0.9 \cdot V_3 + 0.1 \cdot T_5 = 0.9 \cdot 30.752 + 0.1 \cdot 33 = 27.6768 + 3.3 = 30.9768

---

### **Plotting and Interpretation**

If we plot the original temperature values against the calculated VtV_t values, we’ll notice a smooth curve that follows the overall trend but filters out day-to-day fluctuations. This smoothed sequence—your EWMA—can now serve as a **trend line** or, in the context of deep learning, a **smoothed estimate of gradients or squared gradients** across iterations.

---

### **Impact of the Beta (β) Parameter**

Now that we’ve seen how EWMA is calculated, let’s examine the role of the **β (beta)** parameter more closely. Beta is not just a constant in the formula—it fundamentally shapes the **behavior** of the moving average, controlling how **quickly** it reacts to new data and how much it “remembers” from the past.

Vt=β⋅Vt−1+(1−β)⋅TtV_t = \beta \cdot V_{t-1} + (1 - \beta) \cdot T_t

Recall that:

- A **higher β** gives **more weight to past values** (i.e., stronger memory),
    
- A **lower β** gives **more weight to the current value** (i.e., quicker reaction).
    

---

#### **Intuitive Rule of Thumb: 1 / (1 - β)**

There’s a useful way to **approximate** how many past data points the EWMA is effectively averaging:

Effective Window Size≈11−β\text{Effective Window Size} \approx \frac{1}{1 - \beta}

This gives an intuition for how much history is retained in the moving average:

- If β=0.9\beta = 0.9,
    
    11−0.9=10\frac{1}{1 - 0.9} = 10
    
    The EWMA behaves roughly like a **10-point average**. It's smooth, stable, and slower to react.
    
- If β=0.5\beta = 0.5,
    
    11−0.5=2\frac{1}{1 - 0.5} = 2
    
    The EWMA reacts quickly, behaving like a **2-point average**. It follows the data more closely but fluctuates more.
    

---

#### **Effect on the EWMA Graph**

Let’s consider what this means visually. Suppose we’re plotting the EWMA of temperature readings:

- **High β values** (e.g., 0.98, 0.9):
    
    - Result in a **smooth, stable curve** that filters out short-term noise.
        
    - The curve reacts slowly to sudden spikes or dips.
        
    - Useful when we want to emphasize long-term trends and ignore volatility.
        
- **Low β values** (e.g., 0.5, 0.1):
    
    - Result in a **spiky, reactive graph** that closely follows the most recent data.
        
    - The curve is sensitive to sudden changes, responding almost immediately.
        
    - Useful when we want to track rapid changes but are okay with more noise.
        

---

#### **Choosing the Right Beta**

There’s no one-size-fits-all value for β. The choice depends on the **desired trade-off between stability and responsiveness**:

- **Too high**, and the EWMA may ignore recent important changes.
    
- **Too low**, and the EWMA may become overly reactive and noisy.
    

In deep learning, a **β of 0.9 is a commonly used default**, striking a good balance for many tasks. For example:

- In **Momentum**, β controls how much past gradient influence is retained.
    
- In **Adam**, β governs the decay rate for both the first and second moment estimates.
    

Understanding the behavior of β is key to tuning optimizers effectively.

---

### **Mathematical Proof of Weight Distribution in EWMA**

So far, we’ve described the behavior of the Exponentially Weighted Moving Average (EWMA) intuitively, observed it through examples, and explored how the **β** parameter controls its responsiveness. But to fully appreciate its mathematical elegance, let’s now look at a **formal expansion** of the EWMA formula. This will show exactly **how past data points contribute** to the current value, and why newer values exert more influence than older ones.

---

#### **Starting with the Recursive Formula**

Recall the standard EWMA update equation:

Vt=β⋅Vt−1+(1−β)⋅TtV_t = \beta \cdot V_{t-1} + (1 - \beta) \cdot T_t

We’ll now expand this equation recursively to understand the structure of VtV_t in terms of all previous data points.

---

#### **Step-by-Step Expansion**

Let’s take a concrete example by expanding V4V_4. Starting from the base formula:

V4=β⋅V3+(1−β)⋅T4V_4 = \beta \cdot V_3 + (1 - \beta) \cdot T_4

Substitute V3V_3:

V3=β⋅V2+(1−β)⋅T3⇒V4=β(βV2+(1−β)T3)+(1−β)T4V_3 = \beta \cdot V_2 + (1 - \beta) \cdot T_3 \Rightarrow V_4 = \beta (\beta V_2 + (1 - \beta) T_3) + (1 - \beta) T_4

Now substitute V2V_2:

V2=βV1+(1−β)T2⇒V4=β2(βV1+(1−β)T2)+β(1−β)T3+(1−β)T4V_2 = \beta V_1 + (1 - \beta) T_2 \Rightarrow V_4 = \beta^2 (\beta V_1 + (1 - \beta) T_2) + \beta (1 - \beta) T_3 + (1 - \beta) T_4

One more expansion using V1V_1:

V1=βV0+(1−β)T1⇒V4=β3V0+β2(1−β)T1+β(1−β)T2+(1−β)T3+(1−β)T4V_1 = \beta V_0 + (1 - \beta) T_1 \Rightarrow V_4 = \beta^3 V_0 + \beta^2 (1 - \beta) T_1 + \beta (1 - \beta) T_2 + (1 - \beta) T_3 + (1 - \beta) T_4

---

#### **General Pattern: Decaying Weights**

We can now observe a clear **weighting pattern**:

$V_4 = (1 - \beta) \cdot \left[T_4 + \beta T_3 + \beta^2 T_2 + \beta^3 T_1\right] + \beta^4 V_0$

This generalizes to:

$V_t = (1 - \beta) \cdot \sum_{k=0}^{t-1} \beta^k T_{t-k} + \beta^t V_0$

Each previous data point $T_{t-k}$ is **multiplied by $\beta^k (1 - \beta)$**, where:

- $k = 0$ gives us the most recent point: weight = $(1 - \beta)$
    
- $k = 1$: weight = $\beta (1 - \beta)$
    
- $k = 2$: weight = $\beta^2 (1 - \beta)$
    
- And so on...
    

Because $\beta \in (0, 1)$, we know:

$\beta^3 < \beta^2 < \beta < 1$

Thus, **older values receive exponentially smaller weights**, while the most recent data contributes the most. This **mathematically proves** our earlier intuition that EWMA favors newer points while gradually "forgetting" the older ones.

The final term, βtV0\beta^t V_0, also becomes negligible over time if V0V_0 is not set carefully. This is the reason why some optimizers, like Adam, **use bias correction** to remove the impact of this term early in training—something we’ll revisit shortly.

---

### **Python Implementation of EWMA**

After exploring the theory and mathematics behind Exponentially Weighted Moving Averages (EWMA), let’s now turn to its implementation in Python. The goal here is to see how easily we can compute and visualize EWMA using real or synthetic data, and understand how different **β** values affect the resulting trend.

The **Pandas** library offers a built-in function called `ewm()` that simplifies the computation of EWMA for time series data. This function is highly flexible and well-optimized.

---

#### **Understanding the `alpha` Parameter**

Before we dive into code, there's one small detail to note:  
Pandas uses **alpha** as its parameter instead of beta.

$\alpha = 1 - \beta$

So, if your desired **β = 0.9**, you would pass **α = 0.1** to the function.

---

#### **Example: EWMA on Temperature Data**

Let’s walk through a simple example using synthetic temperature data:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Sample temperature data (in °C)
data = {
    'Day': ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    'Temperature': [30, 32, 31, 35, 33]
}
df = pd.DataFrame(data)

# Convert day labels to numerical index for plotting
df.index = range(1, len(df) + 1)

# Desired Beta value
beta = 0.9
alpha = 1 - beta  # Pandas expects alpha

# Calculate EWMA using pandas
df['EWMA (Beta=0.9)'] = df['Temperature'].ewm(alpha=alpha, adjust=False).mean()

# Plotting
plt.figure(figsize=(8, 5))
plt.plot(df.index, df['Temperature'], label='Original Temperature', marker='o')
plt.plot(df.index, df['EWMA (Beta=0.9)'], label='EWMA (Beta=0.9)', linestyle='--', marker='x')
plt.xlabel('Day')
plt.ylabel('Temperature (°C)')
plt.title('Exponentially Weighted Moving Average (EWMA)')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
```

---

#### **Output and Interpretation**

This simple code:

- Creates a small DataFrame with daily temperatures,
    
- Calculates the EWMA using the `ewm()` function,
    
- Plots both the original and smoothed curves.
    

You’ll notice that the EWMA line is smoother and lags slightly behind the original values—exactly what we expect from exponential averaging.

---

#### **Hands-On Exercises**

To reinforce your understanding, try the following:

1. **Vary the beta value** (e.g., 0.5, 0.1, 0.98) and observe how the curve changes.
    
2. **Implement EWMA manually** using a loop and the recursive formula:
    
    $V_t = \beta \cdot V_{t-1} + (1 - \beta) \cdot T_t$
3. **Use a larger dataset**, such as stock prices or weather records, and apply the same technique.
    
---

# **SGD with Momentum: Motivation and Intuition**

As we continue our deep learning journey into optimization, we now shift from foundational concepts—like Gradient Descent and EWMA—into **powerful enhancements** that make neural network training faster, more stable, and more efficient.

The first technique we’ll explore is **Stochastic Gradient Descent with Momentum**—commonly known as **SGD with Momentum**. It is one of the most **widely used and influential optimizers** in practice and a key stepping stone toward even more advanced methods like RMSprop and Adam.

At its core, SGD with Momentum is not a reinvention of gradient descent, but rather an **elegant improvement**. It uses the concept of **Momentum**, which we now understand as an application of **Exponentially Weighted Moving Averages (EWMA)**—but instead of smoothing temperature or price data, we smooth the **gradients** over time.

This technique doesn't just accelerate training; it also helps **stabilize** the learning process, especially in regions of the loss surface where **naive SGD might zig-zag or get stuck**. By accumulating past gradient directions, Momentum gives the optimizer **inertia**—the ability to push through flat regions and dampen sharp turns.

You’ll find that **Momentum is not unique to SGD**. It serves as a **building block for many other optimizers** we’ll study later, including Nesterov Accelerated Gradient and Adam. That’s why it’s essential to deeply understand both the **intuition** and the **mechanics** of Momentum.

In the sections that follow, we’ll start by revisiting SGD, identify where it struggles, and then explore how adding Momentum resolves many of those issues. Our goal is to not just understand the mathematics but to **build intuition**—something that’s often more challenging and more valuable in the long run.

Let’s begin by briefly recapping how **standard SGD works**, so we can appreciate what Momentum brings to the table.

---

## **Basic Concepts and Visualizations: Prerequisites for Understanding Optimization**

Before diving into the mechanics of **SGD with Momentum**, it’s important to establish a shared visual vocabulary. Optimization in deep learning often takes place in **high-dimensional spaces**—but the tools we use to understand and teach it are necessarily **2D or 3D simplifications**. To fully grasp the intuition behind optimizers like Momentum, RMSprop, or Adam, we need to be comfortable reading and interpreting **loss landscapes** and **gradient flows**.

Let’s begin with the basics.

---

### **The Deep Learning Context**

At the heart of any deep learning model is the goal of minimizing a **loss function**. The model receives some **input features**, applies transformations through layers (governed by **weights and biases**), and outputs a prediction y^\hat{y}. This prediction is compared to the actual target value yy, and the **loss function** quantifies the difference between them.

A common loss function in regression tasks is **Mean Squared Error**:

Loss=(y−y^)2\text{Loss} = (y - \hat{y})^2

Crucially, this loss is not just a number—it’s a function of the model’s **parameters** (weights and biases). Our task in optimization is to adjust these parameters such that the loss reaches its **minimum**.

---

### **Why Visualizations Are Challenging but Necessary**

In practice, neural networks may have **thousands or even millions of parameters**, which means the loss function exists in an equally high-dimensional space. Unfortunately, humans can't visualize functions over 100 dimensions, let alone a million.

So we simplify. We use **reduced visualizations** to illustrate how the loss changes with respect to **one or two parameters** at a time, helping us intuitively understand what optimization looks like.

---

### **Understanding the Different Graphs**

To interpret optimizer behavior, we’ll use three core types of visualizations:

#### **1. 2D Loss Graphs (Single-Parameter View)**

In this graph, we plot the **loss** on the Y-axis and a **single parameter** (like a weight WW) on the X-axis. This shows how the loss changes as one weight changes—ideal for illustrating gradient descent along a simple curve. The **slope of the curve** corresponds to the gradient, and optimization is visualized as sliding down the curve toward the minimum.

#### **2. 3D Loss Surface (Two-Parameter View)**

Here, we plot **loss as a surface** over two parameters—often a weight WW and a bias BB. This 3D bowl-shaped surface helps us visualize **gradient directions** and how the optimizer moves across this surface. It becomes particularly useful when explaining **oscillations, curvature, and momentum-based acceleration**.

#### **3. Contour Plot (2D Projection of 3D Surface)**

Contour plots are perhaps the most **intuitive and information-dense** visual tool for optimizers. They’re a top-down projection of the 3D surface, showing **lines of constant loss**—like elevation lines on a map. These plots help us:

- Visualize **direction and steepness** of the gradient,
    
- Interpret **optimizer trajectories**,
    
- Identify **valleys, plateaus, and saddle points**.
    

Closely packed contours mean a **steep slope** (sharp gradient), while widely spaced contours represent **flat regions** where gradients are small. These plots are often color-coded to represent the third dimension (loss), with darker regions indicating lower loss.

---

By familiarizing ourselves with these visual representations, we gain an intuitive feel for how optimizers "navigate" the loss landscape. This understanding will be essential as we explore **SGD with Momentum**, where gradients not only guide movement, but accumulate over time like physical momentum rolling through a valley.

In the next section, we’ll begin by revisiting **SGD** to identify the core challenge it faces—and how Momentum elegantly solves it.

---

## **Convex vs. Non-Convex Optimization**

As we continue to build intuition around optimization in deep learning, it's important to take a moment to understand the **nature of the loss surfaces** we deal with—specifically, whether they are **convex** or **non-convex**. This distinction plays a central role in how difficult it is to train neural networks, and why optimizers need to do more than just follow gradients.

---

### **What Is Convex Optimization?**

In convex optimization problems, the **loss surface has a single global minimum**. Imagine a perfect U-shaped bowl—no matter where you start on the curve, moving downhill via gradient descent will always take you to the lowest point.

Mathematically, a function is convex if the line segment between any two points on its graph lies **above or on the graph itself**. For convex functions, **local minima are guaranteed to be global minima**.

Convex optimization is **well-understood**, **efficient**, and **reliable**—which is why it's often assumed in classical optimization theory.

---

### **Non-Convex Optimization: The Reality of Deep Learning**

Unfortunately, deep learning doesn't live in that simple world.

As soon as we introduce **multiple layers, nonlinear activations, and large parameter spaces**, the resulting loss functions become **non-convex**. These surfaces resemble a chaotic landscape of **valleys, hills, plateaus, ridges, and ravines**—which makes finding the true minimum far more challenging.

In this landscape, optimizers must navigate a terrain full of traps and complications. Let’s look at the main ones.

---

### **Why Non-Convex Optimization Is Hard**

#### **1. Local Minima**

These are points where the gradient is zero, but the loss is **not** the lowest possible value.

- An optimizer that lands here may **get stuck** and never reach the global minimum.
    
- In high-dimensional deep learning settings, local minima are less of a concern than they were once thought to be—but they still represent **suboptimal convergence**.
    

#### **2. Saddle Points**

These are **even trickier** than local minima. A saddle point is a position where:

- The gradient is zero (or very close),
    
- The surface **curves upward in one direction and downward in another**.
    

An optimizer may misinterpret a saddle point as a minimum and **slow to a crawl**, wasting iterations in a region that isn’t productive. In deep networks with thousands of parameters, **saddle points are far more common than local minima**, and represent a major challenge for gradient-based methods.

#### **3. High Curvature**

Some regions of the loss surface may have **sharp changes in slope**—a phenomenon called **high curvature**.

- In such areas, small changes in direction can cause **overshooting**, **oscillations**, or **unstable learning**.
    
- Optimizers like vanilla SGD often suffer from zig-zagging in these regions, especially along narrow valleys or ridges.
    

---

These challenges make deep learning optimization more than just a downhill walk—it’s a problem of navigating complex terrain, avoiding traps, and maintaining steady progress.

This is exactly where **Momentum** comes in. As we’ll see next, Momentum helps optimizers **push through saddle points**, **dampen oscillations**, and **accelerate in consistent directions**—all by leveraging the simple yet powerful idea of **exponentially weighted gradient accumulation**.

---

## **Limitations of Standard Gradient Descent Variants**

Now that we've explored the challenges of **non-convex optimization** in deep learning—such as **local minima**, **saddle points**, and **regions of high curvature**—it becomes clear why we need more sophisticated optimization techniques. But before we introduce those enhancements, it's important to evaluate **how well the basic variants of Gradient Descent perform** in practice.

Let’s briefly revisit the three classical forms of Gradient Descent: **Vanilla Gradient Descent (Batch GD)**, **Stochastic Gradient Descent (SGD)**, and **Mini-batch Gradient Descent**—and assess how they behave in a relatively simple scenario: a **convex loss surface**.

---

### **Demonstration: Gradient Descent Variants on a Convex Problem**

Imagine optimizing a simple **3D paraboloid loss surface**, shaped like a bowl. This is a **convex function**, so any descent method should eventually reach the global minimum. Here’s how each variant behaves:

#### **1. Batch Gradient Descent (Vanilla GD)**

This variant calculates the gradient using the **entire training dataset** before taking a single update step.

- On a convex surface, it **moves smoothly and directly** toward the minimum.
    
- It is **stable** and **accurate**, but computationally expensive for large datasets.
    

#### **2. Stochastic Gradient Descent (SGD)**

SGD updates weights **after every single data point**.

- Its trajectory is **noisy and erratic**, jumping around due to variance in the gradients.
    
- While it does eventually find the minimum, it often **oscillates** around it and takes **longer to converge**.
    
- On a convex surface, this jittery behavior is tolerable—but on complex, non-convex surfaces, it becomes a liability.
    

#### **3. Mini-Batch Gradient Descent**

This strikes a balance by updating weights after seeing **a small batch of examples** (e.g., 32 or 64 samples).

- It provides a **middle ground**—less noisy than SGD, more efficient than full-batch GD.
    
- It performs reliably on convex problems, reaching the minimum with **moderate smoothness**.
    

---

### **But What About Non-Convex Surfaces?**

Unfortunately, once we move to **non-convex loss landscapes**, all three of these variants struggle. None of them:

- Address the **inertia needed to escape saddle points**,
    
- Handle **sharp curvatures** efficiently,
    
- Or **adaptively accelerate** in promising directions.
    

SGD in particular may wander erratically in flat regions or get trapped near saddle points. Mini-batch GD suffers from similar issues—just slightly dampened.

This is why we turn to smarter strategies—like **Momentum**—which can remember the direction of movement, smooth out noise, and push through unproductive regions of the landscape.

In the next section, we’ll see how Momentum modifies SGD to overcome these very limitations, using the foundational idea of **Exponentially Weighted Moving Averages**—now applied to gradients.

---

## **Why Use Momentum Optimization?**

As we’ve seen so far, traditional gradient-based optimization techniques—like SGD and its variants—can struggle in the complex, high-dimensional landscapes typical of deep learning. These methods are particularly vulnerable to **slow progress in flat regions**, **erratic movement in noisy gradients**, and **difficulty escaping traps like local minima or saddle points**.

This is precisely where **Momentum optimization** comes in.

Inspired by physics, the idea behind Momentum is to **simulate the motion of a ball rolling down a slope**. In classical SGD, the optimizer takes one step at a time based only on the current gradient. But with Momentum, the optimizer retains a **velocity vector**—a memory of past gradients—which helps it continue moving in productive directions and dampens unnecessary oscillations.

Let’s explore the three core reasons why **Momentum is not just helpful, but essential** in many deep learning scenarios:

---

### **1. Handling Gradual Slopes (Small Gradients)**

In some regions of the loss surface, the slope is nearly flat—meaning the gradients are very small.

- Without momentum, the optimizer moves slowly and can take many iterations to make meaningful progress.
    
- **Momentum accumulates gradient information**, allowing the optimizer to **accelerate through flat regions**, even when the slope is weak.
    

This makes it especially valuable in deep networks, where plateaus and slow zones are common.

---

### **2. Escaping Local Minima**

Local minima can trap a standard optimizer because once the gradient becomes zero, it has no direction to move.

- Momentum gives the optimizer **inertia**—it can carry enough "velocity" from previous steps to **push through** shallow local minima and continue exploring the loss surface.
    
- This dynamic often results in **better final convergence** and avoids settling too early on suboptimal solutions.
    

---

### **3. Navigating High Curvature (Sharp Valleys and Ridges)**

In regions of high curvature—where the slope changes steeply in one direction and gradually in another—vanilla SGD tends to **zig-zag**, especially if the learning rate isn’t carefully tuned.

- Momentum reduces these oscillations by **averaging out abrupt gradient changes**, leading to **smoother and more stable updates**.
    
- The result is a trajectory that cuts **efficiently through narrow valleys**, without bouncing from one side to the other.
    

---

### **Momentum Summarized**

So, why use Momentum?

Because it tackles three major roadblocks that standard gradient descent methods can’t handle well:

- **Slow training in flat regions,**
    
- **Trap-prone behavior around local minima,**
    
- **Inefficient movement in high-curvature zones.**
    

It’s a remarkably **simple enhancement**, but its impact is profound—especially when training deep neural networks.

Now that we understand why Momentum is valuable, let’s break down exactly **how it works**, how it **modifies the gradient update rule**, and how it builds on the Exponentially Weighted Moving Average we’ve already studied.

---

## **Core Principle and Intuition of Momentum**

Now that we've seen **why Momentum is useful**, let’s build a deep **intuitive understanding** of how it works. While the math is relatively straightforward, it's the **idea behind it** that gives Momentum its power—and once grasped, it makes later optimizers (like Nesterov and Adam) far easier to comprehend.

---

### **Momentum Is About Building Confidence Over Time**

Imagine you're trying to optimize a function and you repeatedly see gradients pointing in the **same general direction**. Instead of cautiously taking equal-sized steps every time (as vanilla SGD does), you start to **trust this direction** and move **faster and more decisively**.

Momentum embodies this exact behavior:

> If gradients are consistent across iterations, the optimizer builds up **velocity** in that direction and moves more quickly.

This helps the model:

- Traverse flat or shallow regions more rapidly,
    
- Maintain stability in noisy updates,
    
- Push through local minima instead of getting stuck.
    

---

### **Car Analogy: Consensus of Direction**

Think of it like driving a car.  
You're unsure where to go, so you ask people on the street for directions:

- If **everyone points in the same direction**, you drive confidently and pick up speed.
    
- If **directions are mixed**, you move more hesitantly—maybe still forward, but slower.
    

Momentum uses this principle with gradients:

- **Consistent gradients? → Faster movement.**
    
- **Inconsistent gradients? → Slower, cautious movement.**
    

---

### **Physics Analogy: A Ball Rolling Downhill**

The term **"momentum"** comes from classical mechanics—where momentum is the product of **mass and velocity**. In our case, we don’t simulate mass, but we **track velocity** using the **history of gradients**.

Imagine a ball rolling down a hill:

- As it rolls, it gains **speed and direction** from the slope (gradient).
    
- Even if the slope flattens out briefly, the ball keeps moving forward—**inertia** carries it on.
    
- If the hill turns sharply or curves around, the ball might wobble or slow—but it won’t instantly stop.
    

This is precisely how Momentum helps an optimizer:

- It adds **inertia** to the gradient updates.
    
- It reduces jerky, abrupt changes.
    
- It smooths out the learning path and **accelerates convergence**.
    

---

### **Why Momentum Is Faster Than SGD**

The most important advantage of using Momentum? **Speed.**

By leveraging the accumulated direction of past gradients, Momentum:

- Avoids re-evaluating the same directions repeatedly,
    
- Pushes through slow zones and small slopes,
    
- Learns faster and more efficiently in practice.
    

In fact, in most real-world deep learning scenarios, **Momentum outperforms vanilla SGD** in both speed and stability—making it a default choice in many frameworks and architectures.

---

In the next section, we’ll look at how this intuition translates into an actual **update rule**, using the same EWMA principle we covered earlier—now applied to gradients rather than temperature or time series data.

---

## **Mathematical Implementation of Momentum**

We now arrive at the **formal definition** of how Momentum optimization works. Building on our earlier discussion of **Exponentially Weighted Moving Averages (EWMA)**, Momentum introduces a new quantity—**velocity**—that accumulates past gradients and injects **inertia** into the optimization process.

Let’s begin by reviewing how standard gradient descent works and then see how Momentum modifies this routine.

---

### **Standard Gradient Descent**

The weight update rule in vanilla Gradient Descent is simple:

Wt+1=Wt−η⋅∇L(Wt)W_{t+1} = W_t - \eta \cdot \nabla L(W_t)

Where:

- WtW_t is the weight vector at step tt,
    
- η\eta is the learning rate,
    
- ∇L(Wt)\nabla L(W_t) is the gradient of the loss function with respect to the weights.
    

This update rule only uses **the current gradient**, which makes it sensitive to noise and local surface geometry. There's no concept of memory or accumulated direction.

---

### **Momentum: Adding Velocity to the Update**

Momentum introduces a new term: **velocity**, denoted VtV_t, which behaves like a running average of gradients:

Vt=β⋅Vt−1+η⋅∇L(Wt)V_t = \beta \cdot V_{t-1} + \eta \cdot \nabla L(W_t)

Then, instead of updating the weight using the raw gradient, we update it using the **velocity**:

Wt+1=Wt−VtW_{t+1} = W_t - V_t

Where:

- VtV_t: Velocity at step tt—an **EWMA of past gradients**, scaled by learning rate.
    
- β∈[0,1)\beta \in [0, 1): Decay factor (typically 0.9), controlling how much past gradients influence the current step.
    
- η\eta: Learning rate, just as in standard SGD.
    
- ∇L(Wt)\nabla L(W_t): Current gradient.
    

---

### **Breaking It Down: What’s Happening Here?**

1. **β⋅Vt−1\beta \cdot V_{t-1}**  
    This term incorporates the **history** of previous updates. The higher the beta, the more previous gradients affect the current velocity.
    
2. **η⋅∇L(Wt)\eta \cdot \nabla L(W_t)**  
    This is the **current gradient**, scaled by the learning rate.
    
3. **Subtraction from WtW_t**  
    Once the velocity is computed, it's subtracted from the current weights. This step is what moves the model in the direction of the **cumulative gradient**, not just the most recent one.
    

---

### **How Momentum Accelerates Learning**

The power of Momentum lies in the fact that **repeated gradients in the same direction cause velocity to build up**, leading to **larger, faster steps** in that direction. On the other hand, if gradients start changing direction, the accumulated velocity dampens this effect—**smoothing out noise**.

In flat regions, where gradients are tiny, the velocity carries forward, helping the optimizer escape stagnation. In steep curved valleys, Momentum reduces zig-zagging and allows the optimizer to move along the more relevant direction.

---

### **Summary of Momentum Update Logic**

|Step|Formula|
|---|---|
|Compute Velocity|Vt=β⋅Vt−1+η⋅∇L(Wt)V_t = \beta \cdot V_{t-1} + \eta \cdot \nabla L(W_t)|
|Update Weights|Wt+1=Wt−VtW_{t+1} = W_t - V_t|

This is the **complete implementation of Momentum** in its simplest and most widely used form. Most modern deep learning frameworks (like PyTorch, TensorFlow, and Keras) implement this exact logic under the hood.

---

## **Impact of Momentum on Gradient Descent Navigation**

Now that we’ve seen the mathematical foundation of Momentum, let’s explore how it changes the **actual path** an optimizer takes when minimizing a loss function.

To do this, we’ll use one of the most powerful tools for visualizing optimization behavior: the **contour plot**.

---

### **The Scenario: A Narrow Valley in the Loss Surface**

Imagine optimizing a loss function that resembles a **long, narrow valley**.

- The valley is shallow in the **horizontal direction** (think: weight W1W_1),
    
- But steep in the **vertical direction** (think: weight ( W_2 \ )).
    

This kind of landscape is very common in deep learning, where different parameters have different sensitivities.

---

### **How Standard SGD Behaves**

In this setting, **standard SGD**—which updates parameters based only on the current gradient—tends to behave inefficiently:

- It takes **large steps up and down across the steep (vertical) walls** of the valley,
    
- While making **slow progress along the shallow (horizontal) valley floor**.
    

As a result, its path **zig-zags** heavily and wastes many steps bouncing from side to side, rather than progressing directly toward the minimum.

This **oscillatory behavior** delays convergence and makes training less efficient.

---

### **How Momentum Changes the Dynamics**

Now introduce **Momentum**. Since it **accumulates velocity over time**, its behavior changes significantly:

- In the **horizontal direction** (along the valley), gradients are **consistent** over time. So velocity builds up, and the optimizer moves **faster and smoother** in that direction.
    
- In the **vertical direction**, gradients **flip back and forth**—one step it's up, the next it's down. As a result, the accumulated velocity cancels out and Momentum **dampens these oscillations**.
    

The result?  
Momentum **naturally aligns the update direction with the axis of consistent descent**—the valley floor—allowing the optimizer to:

- **Minimize wasteful vertical movement,**
    
- **Accelerate along the true path to the minimum**, and
    
- **Converge much faster** than standard SGD.
    

---

### **Visual Summary**

On a contour plot:

- The **SGD path** appears as a zig-zag trajectory across contour lines, slowly inching toward the center.
    
- The **Momentum path** follows a smoother, more diagonal route—**closely hugging the valley floor**, minimizing energy wasted in the perpendicular direction.
    

This is one of Momentum’s greatest strengths: it doesn’t just follow the gradient—it **learns the geometry of the surface over time** and adapts its movement accordingly.

---

## **Role of Beta (β) in Momentum**

At the heart of the Momentum optimizer lies the **beta parameter (β)**—also known as the **decay factor**. This single number plays a critical role in determining **how much past gradients influence the present update**.

Understanding how β affects the Momentum update is essential not just for theoretical clarity, but also for practical tuning when training deep learning models.

---

### **What Does Beta Actually Do?**

Recall the Momentum update formula:

Vt=β⋅Vt−1+η⋅∇L(Wt)V_t = \beta \cdot V_{t-1} + \eta \cdot \nabla L(W_t) Wt+1=Wt−VtW_{t+1} = W_t - V_t

Here, VtV_t is a **velocity vector**, which combines:

- The **previous velocity** (Vt−1V_{t-1}) scaled by β, and
    
- The **current gradient**, scaled by the learning rate η\eta.
    

The beta parameter β∈[0,1)\beta \in [0, 1) determines **how much of the past velocity carries forward** into the next update. A **larger β** means **more memory**, while a **smaller β** results in **faster decay** of past influence.

---

### **Beta as an EWMA Window Approximation**

Just like in Exponentially Weighted Moving Averages (EWMA), we can approximate the effective memory of the velocity as:

Effective window size≈11−β\text{Effective window size} \approx \frac{1}{1 - \beta}

For example:

- If β=0.9\beta = 0.9, it’s roughly like averaging over the last **10 iterations**.
    
- If β=0.99\beta = 0.99, it’s like averaging over the last **100 steps**.
    

This means that higher beta values produce **smoother**, **more stable** velocities that average out noise, but they **react more slowly** to sudden changes in gradient direction.

---

### **Effects of Different Beta Values**

Let’s explore how the choice of β changes the behavior of Momentum:

#### **1. β = 0**

- The momentum term β⋅Vt−1\beta \cdot V_{t-1} becomes zero.
    
- The update simplifies to:
    
    Vt=η⋅∇L(Wt)V_t = \eta \cdot \nabla L(W_t)
- This is simply **standard SGD**. No memory, no acceleration—Momentum is effectively disabled.
    

#### **2. β Close to 1 (e.g., 0.99)**

- Past velocities decay **very slowly**.
    
- Momentum accumulates over a **longer history**.
    
- The optimizer becomes **very stable**, but may take time to adapt to sudden gradient shifts.
    
- Best used in settings where gradient noise is high, and long-term directional consistency is valuable.
    

#### **3. β = 1**

- There is **no decay at all**—old velocities are preserved forever.
    
- This can lead to a form of **dynamic equilibrium**, where the velocity dominates the gradient and the optimizer **fails to converge**.
    
- Such a setting is **not practical** and generally avoided.
    

---

### **Best Practice**

In most deep learning applications, a value of:

- β=0.9\beta = 0.9 offers a **good balance** of smoothing and responsiveness.
    
- β=0.99\beta = 0.99 may be preferred for **noisier gradients** or large-batch training.
    

Ultimately, β is a **hyperparameter**—and while these defaults work well in many settings, it's important to consider tuning it when convergence is too slow or too unstable.

---

## **Benefits and Problems of Momentum Optimization**

Momentum optimization is a widely adopted enhancement to standard gradient descent methods, known for its ability to accelerate convergence and provide greater stability during training. However, like all optimization techniques, it presents both advantages and trade-offs. This section examines the strengths of Momentum and its principal drawback, laying the groundwork for understanding more advanced optimizers that build upon it.

---

### **Benefits of Momentum**

#### **1. Faster Training through Accumulated Gradients**

One of the most significant advantages of Momentum is its ability to accelerate learning. By incorporating a running average of past gradients, the optimizer builds up "velocity" in directions that consistently reduce the loss. This enables the optimizer to take longer steps in the right direction, leading to faster progress—particularly in areas where the gradient remains steady.

This mechanism is often compared to a ball rolling downhill: as it continues to move, it gains speed due to the slope and previous motion. Momentum mimics this behavior by reinforcing gradient directions that are stable over time.

#### **2. Ability to Escape Local Minima**

In non-convex optimization landscapes, shallow local minima can trap standard gradient descent methods, especially when gradients vanish. Momentum provides the optimizer with enough accumulated energy to overcome such local minima and continue searching the parameter space. This allows it to avoid getting stuck prematurely and improves the likelihood of reaching a better overall solution.

#### **3. Improved Stability in High-Curvature and Noisy Regions**

Momentum also performs well in challenging regions of the loss surface, such as:

- **High-curvature regions**, where gradients change sharply in one dimension but remain shallow in another,
    
- **Noisy regions**, where gradients fluctuate due to mini-batch sampling or inherent variability.
    

By smoothing the update direction through exponential averaging, Momentum reduces erratic steps and prevents the optimizer from zig-zagging excessively. This leads to a more stable and efficient path toward convergence.

---

### **Limitation of Momentum: Overshooting and Oscillation**

The primary drawback of Momentum arises from the very property that enables its acceleration—accumulated velocity. As the optimizer approaches a minimum, the continued momentum may cause it to:

- Overshoot the optimal point,
    
- Oscillate around the minimum before settling,
    
- Require more iterations to stabilize near the solution.
    

This overshooting is particularly pronounced if the learning rate or beta value is too high, causing the optimizer to repeatedly cross over the optimal point. The resulting oscillation can delay convergence, especially in the final stages of training where precise steps are needed.

---

### Summary

|Aspect|Description|
|---|---|
|Faster convergence|Builds velocity in consistent gradient directions to accelerate learning|
|Escapes local minima|Retains momentum to push through shallow loss regions|
|Stabilizes updates|Averages past gradients to smooth out noisy or high-curvature updates|
|Potential overshooting|May oscillate near the minimum if velocity is not controlled|

---

This analysis highlights why Momentum is widely used in practice and also why more advanced optimizers—such as **Nesterov Accelerated Gradient** and **Adam**—were developed to preserve its strengths while mitigating its limitations.

