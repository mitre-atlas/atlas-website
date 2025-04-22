---
title: Autonomous Systems
---

[[toc]]

#### Introduction

As AI is increasingly integrated into autonomous systems to enhance the speed and scale of rapid decision making, society has seen amazing advancements in autonomous applications such as autonomous vehicles operating on public roadways[<sup>\[1\]</sup>][1], improved search and rescue with drones[<sup>\[2\]</sup>][2], and even caregiving for elderly or sick people[<sup>\[3\]</sup>][3]. These applications have often captured public imagination, and innovation is constantly being pursued by researchers and hobbyists alike. While pursuit of innovation is driving fantastic results in this field, the safe, secure, and reliable operation of autonomous systems continues to be a top priority for government and industry organizations. 

Just as incorporating AI into a traditional software system opens the system up for new security threats[<sup>\[4\]</sup>][4], autonomous systems with AI capabilities are also vulnerable to additional security implications that go beyond the traditional hardware or software vulnerabilities that autonomous system experts are accustomed to addressing. Threats to autonomous systems can often include the potential for greater harm to the physical environment around the system; for example, a hacked autonomous vehicle transporting human customers around a city center might be instructed to ignore a stop sign, causing a crash and harming passengers or nearby pedestrians. The motivation for considering AI security implications in the context of autonomous systems, therefore, lies in the need to ensure that safe and reliable operation of these systems, as well as the protection of sensitive data they handle. 

Our MITRE ATLAS team is conducting ongoing research on this intersection of AI security and autonomous systems and options for integrating the unique security considerations for AI-enabled autonomous systems into our existing matrix. As that continues, we wanted to write this article to introduce our initial high-level approach to the security landscape for AI-enabled autonomous systems that starts with a clearer breakdown of the typical stack for an autonomous system. Considering each component of the autonomy stack allows for better identification and understanding of the unique AI integrations and thus vulnerabilities.

Our goal for this work is to introduce AI security researchers to the autonomy stack, and provide new resources for autonomy users or researchers as they consider the AI security implications of their systems. Below you’ll find more information discussing our breakdown of the different components of the autonomy stack to highlight areas that can be enabled with AI.

#### The Autonomy Stack

The general flow of operations for an autonomous system is for the system to sense information about the physical environment around it, make decisions based on that information, and then act autonomously within that environment. The specific applications and technologies used to perform those actions can vary immensely across systems, but the different elements that comprise that system can be generalized into components responsible for conducting specific tasks. The combination of these different components is known as the “autonomy stack”.

The autonomy stack begins with the use of **sensors** such as LiDAR and radar that receive and process sensory input from the environment to conduct the **perception**, **planning**, and **localization** tasks. That collected information then informs decision-making by the system that can be implemented by mechanisms such as a robotic arm or steering wheel. This implementation is done by the **control**, **vehicle interface**, and **hardware controls** components to implement a physical change such as moving an arm or changing lanes in an autonomous vehicle. **Power management** to monitor and incorporate information from power sources involved in the system is another important component here that can inform decision making. **Remote control and data relays** may also be used by an autonomous system to communicate and coordinate actions with other connected autonomous systems. A **user interface** system can also share and receive information from users, such as a human passenger riding inside an autonomous vehicle.

The diagram below represents our visualization of those component types that comprise an AI-enabled autonomy system, using taxonomy and language commonly employed by the autonomy community to represent the industry standard. While each autonomous system is different and some might not use every component of the stack, this visualization still captures the general sense of action throughout an autonomous system as it takes in information from its environment and uses that data to make decisions and enact physical change in the environment. Understanding the points of action and components that enable autonomous systems and where AI is incorporated allows for better identification of the unique paths for attack that threat actors may use on AI-enabled autonomous systems.

<p>
<figure>
    <div class="v-responsive v-img" style="height: 600px;">
      <img src="/content/autonomy/autonomy_stack.png" alt="AI-enabled system" class="v-img__img v-img__img--contain" />
    </div>
    <figcaption class="text-caption text-center mb-4">
    Figure 1: Visualization of an Autonomy Stack for a system enabled for AI/ML
    </figcaption>
</figure>
</p>
 
The diagram breaks down the components of an autonomous system as it inputs information from the environment around it to make decisions and execute physical changes in the environment. Orange bars are used to indicate components that may be equipped with AI algorithms or models. The components marked “optional” in the diagram – sensor fusion and smart sensors – represent a newer practice of incorporating processing power directly into the sensors themselves or the fusion process where input from multiple sensors is combined. While all autonomous systems have some sort of sensor technology, smart sensors or sensor fusion systems that relay processed information are less common. They’re also functionally different enough from a standard input-only sensor, particularly in the context of security vulnerabilities, that we broke them out into a separate optional category. 

#### Threats to AI-enabled Components

The components described above that may be equipped with AI algorithms or models are thus vulnerable to traditional security threats inherent in the component’s hardware or software, as well as new security threats introduced by AI incorporation. While many of these AI-specific threats can be represented more generally with [existing techniques from the ATLAS matrix](https://atlas.mitre.org/matrices/ATLAS), the specific application with an autonomous system can change the threat vector or raise the stakes for a security attack. Unlike other AI applications such as chatbots that are limited to the digital world, the physical embodiment of AI-enabled autonomous systems such as complex robots or vehicles allows for more opportunities to cause physical destruction or bodily harm. We provide a short example below of this danger in specific context of the sensors and smart sensor components of a system.

<p>
<figure>
    <div class="v-responsive v-img" style="height: 400px;">
      <img src="/content/autonomy/lidar.png" alt="Visualization of LiDAR Sensor" class="v-img__img v-img__img--contain" />
    </div>
    <figcaption class="text-caption text-center mb-4">
    Figure 2: Visualization of LiDAR Sensor. Image Source: <a href="https://blogs.nvidia.com/blog/lidar-sensor-nvidia-drive">NVIDIA</a>
    </figcaption>
</figure>
</p>

Often referred to as the “eyes and ears” of an autonomous system, a sensor is a device that measures an element of the autonomous system’s physical environment, such as traffic signs, and relays the information to the system. Sensor examples include cameras, radar, LiDAR, and encoders.

Smart sensors are devices designed to have additional logic, often an AI algorithm, implemented onboard. Smart sensors thus relay processed information to the control system, rather than the raw sensor values. An [AI Camera](https://www.raspberrypi.com/products/ai-camera/) is an example of a smart sensor that can be used in an autonomous system.

**Possible Attack Vectors:**
- “Sensor spoofing” that compromises the software or hardware within a sensor and causes the system to act abnormally or incorrectly. If the attacker is physically near the vehicle, this attack could involve obstruction or adjustment of the sensors themselves. Attackers can also impact the software to modify parameters and cause the sensors to perceive objects at incorrect distances. (Source: [Virigina Tech Transportation Institute Trucking Fleet Concept of Operations: Final Report](https://www.vtti.vt.edu/projects/conops-report.html))
  - LiDAR Spoofing Example: [Sato et al. (2025) On the Realism of LiDAR Spoofing Attacks against Autonomous Driving Vehicle at High Speed and Long Distance](https://www.ndss-symposium.org/wp-content/uploads/2025-628-paper.pdf)
- Tampering the environment with adversarial patch attacks or other physical changes such as road signs can also impact sensory input and cause abnormal behavior that could intentionally damage vehicles or people within/nearby.
  - Physically Realizable Adversarial Example: [Tu et al. (2020): Physically Realizable Adversarial Examples for LiDAR Object Detection](https://ieeexplore.ieee.org/document/9156447)

#### Additional Resources

As we continue to build out our own resources on the ATLAS site about this topic, we have compiled a short list below of external resources about AI-enabled autonomous systems for interested members of the community.
- [Neupanei et al. (2024): Security Considerations in AI-Robotics: A Survey of Current Methods, Challenges, and Opportunities](https://arxiv.org/html/2310.08565v3)
- [Ziong and Jagannathan (2024): Manipulating Neural Path Planners via Slight Perturbations](https://arxiv.org/html/2403.18256v1)
- [Andreoni et al. (2022): Enhancing Autonomous System Security and Resilience with Generative AI: A Comprehensive Survey](https://ieeexplore.ieee.org/document/10623653)
- [Zhang, Jian. (2021): AI based Algorithms of Path Planning, Navigation and Control for Mobile Ground Robots and UAVs](https://arxiv.org/pdf/2110.00910)
- [Partners for Automated Vehicle Education (2021): “Virtual Panel: Securing Automated Vehicles Against Cyber Threats”](https://youtu.be/zVTBxecuQr4?si=qNy2pXTh7dlHYdIc)
- [Tencent Keen Security Lab (2019): Experimental Security Research of Tesla Autopilot](https://keenlab.tencent.com/en/whitepapers/Experimental_Security_Research_of_Tesla_Autopilot.pdf)

For readers interested in learning more about general hardware security in the context of AI systems, please check out [this section](https://atlas.mitre.org/resources/ai-security-101#hardware-security) of our AI Security 101 resource. If you have additional suggestions for new case studies or tactics and techniques that we can add to ATLAS in this topic area, please reach out via [LinkedIn, or email](https://atlas.mitre.org/resources/contact).


[1]: https://waymo.com/research/waymo-public-road-safety-performance-data/ "Waymo public road safety performance data"
[2]: https://publicsafety.ieee.org/topics/how-drones-are-revolutionizing-search-and-rescue "How Drones Are Revolutionizing Search and Rescue"
[3]: https://time.com/5691188/senior-care-robot/ "Stop Me if You’ve Heard This One: A Robot and a Team of Irish Scientists Walk Into a Senior Living Home"
[4]: https://atlas.mitre.org/resources/ai-security-101 "AI Security 101"
