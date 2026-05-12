---
layout: paper
title: "Comparative power spectral analysis of simultaneous electroencephalographic and magnetoencephalographic recordings in humans suggests non-resistive extracellular media"
subtitle: ""
authors: "Nima Dehghani, Claude Bédard, Sydney S. Cash, Eric Halgren, and Alain Destexhe"
date: 2026-05-01
venue: "Paper"
year: 2025
image: /assets/img/papers/depth-cg-teaser.png
tags: [Electromagnetism, Scaling, EEG, MEG, Resistive-Medium, Noise]
arxiv: ""
doi: "10.1007/s10827-010-0263-2"
pdf: ""
repo: "https://github.com/neurovium/depth-coarse-graining"
mirrors:
  - name: ""
    url: "https://link.springer.com/article/10.1007/s10827-010-0263-2"
bibtex: |
  @Article{Dehghani2010,
    author={Dehghani, Nima
    and B{\'e}dard, Claude
    and Cash, Sydney S.
    and Halgren, Eric
    and Destexhe, Alain},
    title={Comparative power spectral analysis of simultaneous elecroencephalographic and magnetoencephalographic recordings in humans suggests non-resistive extracellular media},
    journal={Journal of Computational Neuroscience},
    year={2010},
    month={Dec},
    day={01},
    volume={29},
    number={3},
    pages={405-421},
    issn={1573-6873},
    doi={10.1007/s10827-010-0263-2},
    url={https://doi.org/10.1007/s10827-010-0263-2}
  }


description: "This paper investigates whether the extracellular space in the brain acts as a resistive or non-resistive medium by comparing the frequency scaling of simultaneous EEG and MEG recordings. The study concludes that significant differences in scaling between the two signals suggest the extracellular medium is globally non-resistive, a finding that challenges standard simplified models used in source localization and neural field calculations."
math: true
---

# Electromagnetic scaling in the brain: EEG, MEG, and the resistive-medium assumption

*Companion post to:*  
**Comparative power spectral analysis of simultaneous electroencephalographic and magnetoencephalographic recordings in humans suggests non-resistive extracellular media**  
Nima Dehghani, Claude Bédard, Sydney S. Cash, Eric Halgren, and Alain Destexhe  
*Journal of Computational Neuroscience* 29, 405--421, 2010  
DOI: `10.1007/s10827-010-0263-2`

---

## 1. Why the electrical properties of brain tissue matter

A large part of electrophysiology rests on a deceptively simple physical assumption: that the extracellular medium of the brain behaves, to a good approximation, as a resistive volume conductor.

This assumption is embedded in many models of local field potentials, electroencephalography (EEG), magnetoencephalography (MEG), and source localization. If the medium is resistive, the relation between neural current sources and measured extracellular potentials is greatly simplified. The brain, cerebrospinal fluid, dura, skull, and scalp can be treated as conducting media with conductivities that may vary in space, but not in frequency. In that case, the mathematical problem reduces to a familiar form: currents generate electric potentials through equations closely related to Coulomb's law and Poisson's equation, and magnetic fields can be computed under the quasi-static approximation.

This is not merely a technical convenience. It shapes how we interpret measured signals. It affects how we build forward models, how we infer sources from EEG and MEG, how we interpret the power spectrum of field potentials, and how we connect microscopic current sources to macroscopic measurements.

But the resistive-medium assumption is not guaranteed by first principles. Biological tissue is not a homogeneous salt solution. It contains membranes, ionic concentration gradients, extracellular matrix, glial processes, tortuous extracellular spaces, interfaces between tissue compartments, and frequency-dependent polarization mechanisms. If these features introduce frequency-dependent impedance, then the extracellular medium is not purely resistive. In that case, the medium itself filters neural activity, and the measured spectrum is not simply the spectrum of neural sources projected through a static conductor.

This paper was motivated by that problem.

The central question was:

> Can the macroscopic electromagnetic signals measured by EEG and MEG be reconciled with a purely resistive extracellular medium?

Rather than directly measuring tissue impedance with externally injected currents, we took an indirect route. We asked what Maxwell's equations imply for the frequency scaling of EEG and MEG if the medium is resistive, and then tested that prediction using simultaneous EEG and MEG recordings in humans.

---

## 2. The physical issue: resistive versus non-resistive media

In a purely resistive medium, current density and electric field are related by Ohm's law:

$$
\mathbf{j} = \sigma \mathbf{E},
$$

where $\sigma$ is the conductivity. If $\sigma$ does not depend on frequency, then the medium does not introduce frequency-dependent filtering. The geometry of the volume conductor may still matter, and the conductivity may differ across compartments, but the medium does not reshape the signal spectrum in a frequency-selective way.

A more general linear medium is described by frequency-dependent electrical parameters. In Fourier space, one can write the admittance as

$$
\gamma_f = \sigma_f + i \omega \epsilon_f,
$$

where $\sigma_f$ is the frequency-dependent conductivity, $\epsilon_f$ is the permittivity, and $\omega = 2\pi f$. If $\gamma_f$ depends on frequency, the medium is non-resistive. The extracellular space then acts as a filter whose effect depends on frequency.

The distinction matters because EEG and MEG are not the same physical measurement. EEG measures electric potential differences at the scalp. MEG measures magnetic fields generated by neural currents. These two signals are related to the same underlying neural activity, but they couple differently to the electric and magnetic aspects of the field.

If the medium is purely resistive, the low-frequency scaling of EEG and MEG should be constrained in a particular way. If the medium is non-resistive, this constraint can break.

The paper turns this observation into a testable prediction.

---

## 3. From Maxwell's equations to a spectral prediction

The starting point is Maxwell's equations, written for a linear medium. In the frequency domain, the relevant quantities are the electric field $\mathbf{E}_f$, electric displacement $\mathbf{D}_f$, magnetic induction $\mathbf{B}_f$, magnetic field $\mathbf{H}_f$, and current density $\mathbf{j}_f$. For the low frequencies relevant to EEG and MEG, the quasi-static approximation is usually invoked. Under this approximation,

$$
\nabla \times \mathbf{E}_f \approx 0,
$$

so the electric field can be expressed as the gradient of a scalar potential:

$$
\mathbf{E}_f = -\nabla V_f.
$$

The current density contains the primary current sources generated by neurons, denoted $\mathbf{j}^p_f$, together with the current induced in the extracellular medium. The resulting equation for the electric potential can be written in the form

$$
\nabla \cdot \left( \gamma_f \nabla V_f \right)
=
\nabla \cdot \mathbf{j}^p_f.
$$

This equation is already enough to show why the resistive assumption is special. If $\gamma_f$ is frequency independent, the medium does not add its own spectral dependence. If $\gamma_f$ depends on frequency, then the extracellular medium contributes directly to the frequency dependence of the measured potential.

For the magnetic field, the corresponding expression depends on the curl of the primary current density. In the resistive case, and under the quasi-static approximation, the magnetic induction can be expressed in a form analogous to the Ampère--Laplace law. Importantly, in a purely resistive medium, the magnetic induction depends on the primary currents but not on a frequency-dependent extracellular admittance.

This gives the key prediction of the paper.

If the medium is resistive, and if the spatial and frequency dependence of the primary current density factorize as

$$
\mathbf{j}^p_f(\mathbf{x}) = \mathbf{j}^p_e(\mathbf{x}) F(f),
$$

then the electric potential and magnetic induction should have the same frequency dependence at low frequencies.

Equivalently:

> Under the resistive-medium assumption, the low-frequency power spectral density of EEG and MEG should scale with the same exponent.

This is not a claim that EEG and MEG should have the same amplitude, the same spatial topography, or the same sensitivity profile. They clearly do not. The claim is narrower and more physical: if the medium is resistive, the frequency scaling imposed by the underlying current sources should be shared by both modalities at low frequency.

Thus, the comparison of EEG and MEG spectra becomes a test of the resistive-medium assumption.

---

## 4. Why simultaneous EEG and MEG are essential

Previous work had examined power-law scaling in EEG or MEG separately. But separate recordings cannot cleanly answer the question posed here, because the relevant prediction concerns the relative scaling of electric and magnetic signals generated by the same ongoing brain activity.

For this reason, the study analyzed simultaneous EEG and MEG recordings from awake human subjects. The recordings were obtained during quiet wakefulness, with eyes open, in a desynchronized state. This state is important for the theoretical argument because the derivation assumes that current sources are weakly correlated. In desynchronized, high-conductance-like regimes, synaptic input is intense and relatively decorrelated, making the factorization assumption more plausible than it would be during strongly synchronized rhythms.

The measurements included:

- 60 EEG channels;
- 306 MEG channels from a whole-head Neuromag system;
- magnetometer and gradiometer recordings;
- empty-room MEG recordings acquired before the human recordings.

The analysis focused on the low-frequency range

$$
0.1 \text{ Hz} \leq f \leq 10 \text{ Hz},
$$

because this is the regime where the theoretical prediction is expected to apply most directly and where the quasi-static approximation is appropriate.

---

## 5. Estimating frequency scaling robustly

The quantity of interest was the scaling exponent of the power spectral density. If the PSD follows approximately

$$
P(f) \sim \frac{1}{f^\alpha},
$$

then the exponent $\alpha$ can be estimated from the slope of the spectrum in log-log coordinates:

$$
\log P(f) \sim -\alpha \log f.
$$

In practice, estimating this slope is not trivial. Biological spectra contain peaks, finite-size effects, low-frequency drifts, sensor noise, and deviations from exact power laws. A naive linear fit can be biased by spectral peaks, including residual alpha-band activity around 10 Hz.

To address this, the paper used a B-spline-based procedure. The PSD was first smoothed using optimized knots, with greater resolution assigned to the low-frequency range. The scaling exponent was then estimated from a first-degree polynomial fit to the smoothed log-log spectrum over the relevant frequency interval.

This procedure had two purposes. First, it provided an automated way to handle many channels across EEG and MEG. Second, it reduced the influence of local spectral irregularities while preserving the broad scaling behavior.

The result was a spatial map of scaling exponents for EEG and MEG.

---

## 6. The complication: MEG noise and empty-room correction

MEG is highly sensitive to environmental and instrumental noise. SQUID sensors can also introduce colored noise, including $1/f$-like structure. Therefore, a direct comparison of raw EEG and raw MEG spectra would be insufficient.

The study therefore used empty-room recordings to characterize MEG noise. These empty-room recordings were acquired in the same shielded environment, with no subject present. The resulting spectra revealed that MEG noise itself can have strong low-frequency scaling. In some cases, the empty-room scaling resembled the raw MEG scaling.

This made noise correction essential.

Several correction methods were used, each corresponding to a different assumption about the nature of the noise.

### Exponent subtraction

One possibility is that the observed MEG scaling is largely caused by the frequency response of the sensors. In that case, one can subtract the scaling exponent estimated from the empty-room recording. This is a strong correction and, in practice, nearly abolishes the MEG scaling.

### Linear multiband spectral subtraction

A second possibility is that the noise is additive and uncorrelated with the neural signal. The simplest version of this correction subtracts the empty-room power spectrum from the measured MEG spectrum in frequency bands.

### Nonlinear multiband spectral subtraction

Because MEG signal-to-noise ratio is frequency dependent and spatially variable across sensors, a more appropriate correction uses band-specific SNR estimates. This nonlinear correction accounts for the fact that low-frequency bands have higher SNR and larger sensor-to-sensor variability.

### Wiener filtering

Wiener filtering provides another way to estimate the clean signal from the noisy measurement by minimizing mean-square error. In the frequency domain, the Wiener filter can be expressed in terms of signal and noise power.

### Partial least squares regression

Finally, partial least squares regression was used to identify spectral patterns in the MEG recordings that could be predicted from empty-room noise. The residual component was then interpreted as the part of the spectrum not explained by noise.

The important point is that these methods do not all make the same assumptions. If the EEG--MEG spectral difference disappeared under one correction method but not another, the interpretation would be fragile. Instead, the opposite occurred.

Across correction methods, the EEG--MEG difference persisted, and in several cases became stronger.

---

## 7. The main empirical result: EEG and MEG do not scale the same way

The central empirical finding is that EEG and MEG have different low-frequency scaling exponents.

The EEG spectra showed scaling broadly in the range between

$$
1/f
\quad \text{and} \quad
1/f^2,
$$

with values close to $1/f$ especially along midline regions. Temporal and frontal regions tended to show somewhat larger exponents.

MEG, however, showed a different pattern. Its scaling exponents were more spatially variable and had a distinct topographic organization. In particular, the MEG maps showed:

1. a frontal region with relatively high exponent values;
2. a central region where EEG and MEG exponents could appear closer in value;
3. a parietotemporal horseshoe-like region with lower MEG exponents and broader variability.

This was not simply an amplitude difference. It was a difference in the frequency dependence of the two modalities.

The distinction also persisted after noise correction. Nonlinear multiband spectral subtraction and Wiener filtering preserved the spatial structure of MEG scaling while increasing the difference from EEG. Partial least squares correction produced still lower MEG exponents. Exponent subtraction nearly eliminated MEG scaling, as expected under the strong assumption that the measured scaling was sensor-induced.

Thus, the data did not support the prediction of a common EEG/MEG scaling exponent under a purely resistive medium.

The conclusion is not that every detail of the observed spectra is explained. Rather, the conclusion is that the simplest resistive-volume-conductor picture fails a concrete spectral test.

---

## 8. Why this argues for a non-resistive medium

The theoretical prediction was straightforward:

> If the extracellular medium is resistive, EEG and MEG should have the same low-frequency scaling exponent.

The experimental observation was also clear:

> EEG and MEG do not have the same low-frequency scaling exponent.

This mismatch suggests that the macroscopic medium separating neural current sources from external sensors is not purely resistive. The relevant medium includes not only the immediate extracellular space around neurons, but also the intervening tissue layers through which the electric field is measured: cerebrospinal fluid, dura, skull, and scalp. However, the argument is not simply that one anatomical compartment must be responsible. The point is broader: the effective medium through which the measured fields propagate cannot be treated as a frequency-independent resistor.

A non-resistive medium can introduce frequency-dependent filtering. In such a medium, electric potentials and magnetic fields need not inherit the same spectral dependence from the underlying current sources. This breaks the equality expected under the resistive assumption.

One physically plausible mechanism is ionic diffusion. Diffusive effects can produce a Warburg-type impedance, whose frequency dependence is neither purely resistive nor purely capacitive. A Warburg impedance scales as

$$
Z_W(\omega) \sim \frac{1}{\sqrt{\omega}},
$$

and can contribute to $1/f$-like structure in power spectra. In this view, part of the spectral structure observed in EEG and local field potentials may reflect the filtering properties of the extracellular medium itself, not only the temporal statistics of neural sources.

This does not imply that neural dynamics are irrelevant to $1/f$-like spectra. Rather, it means that the measured spectrum is a compound object. It reflects the interaction between source dynamics, tissue filtering, geometry, cancellation, sensor sensitivity, and noise. A power law in the recorded signal cannot be interpreted as a direct fingerprint of neuronal computation without accounting for the medium.

---

## 9. Consequences for interpreting $1/f$ spectra in neuroscience

Power-law spectra are often treated as signatures of intrinsic neural dynamics. They have been connected to scale-free activity, self-organized criticality, long-range temporal correlations, asynchronous network states, and broadband excitation/inhibition structure. These interpretations may be valuable, but they are incomplete if the recording medium itself contributes to the observed scaling.

The paper therefore makes a methodological point that remains important:

> The spectrum of an extracellular signal is not necessarily the spectrum of the neural source.

This matters especially for low-frequency field potentials, where tissue filtering and volume conduction can be substantial. If the extracellular medium imposes a frequency-dependent transfer function, then the measured PSD can be written schematically as

$$
P_{\mathrm{measured}}(f) = |H(f)|^2 P_{\mathrm{source}}(f),
$$

where $H(f)$ is an effective transfer function of the medium, geometry, and measurement apparatus. A resistive medium corresponds to a much simpler case in which $H(f)$ does not introduce strong frequency dependence. A non-resistive medium does.

This distinction is important for both physics and neuroscience.

For physicists, it emphasizes that the brain's electromagnetic signals should be treated as fields propagating through structured biological media, not as abstract time series detached from their measurement physics.

For neuroscientists, it cautions against assigning all broadband spectral structure to network dynamics. Some portion of the observed scaling may arise from the physical path between neural current sources and sensors.

---

## 10. Consequences for forward models and inverse source localization

Most EEG and MEG forward models assume a resistive volume conductor. This assumption makes the inverse problem tractable. It allows one to construct lead fields that map candidate neural sources to sensor measurements under frequency-independent conductivity assumptions.

If the effective medium is non-resistive, this framework may need to be generalized.

The issue is especially relevant for EEG, because electric potentials are more directly affected by the conductive and dielectric properties of intervening tissue. MEG is often considered less sensitive to skull conductivity than EEG, but the present comparison shows that EEG and MEG may differ not only in spatial sensitivity but also in spectral filtering.

A non-resistive forward model would need to include frequency-dependent admittances:

$$
\gamma_f(\mathbf{x}) = \sigma_f(\mathbf{x}) + i\omega \epsilon_f(\mathbf{x}).
$$

This would change the mapping from neural currents to measured potentials. It would also complicate the inverse problem, because source localization would become frequency dependent in a more fundamental way.

The practical implication is not that all existing EEG/MEG models are invalid. Resistive models may still be useful approximations for many purposes. But the approximation has a domain of validity, and that domain should be tested rather than assumed.

---

## 11. Geometry, cancellation, and spatial averaging

The paper also points to another important issue: EEG and MEG differ in their sensitivity to source geometry.

Extended neural sources can produce partial cancellation. The amount of cancellation differs between EEG and MEG because electric and magnetic measurements respond differently to current orientation, spatial extent, and source configuration. MEG is especially sensitive to tangential currents, whereas EEG is sensitive to both radial and tangential components, although the details depend on head geometry and conductivity.

Spatial averaging also differs between the modalities. EEG potentials are strongly affected by volume conduction and reference choices. MEG sensors measure magnetic fields outside the head and have different spatial sensitivity profiles. These differences can influence spectral scaling if the spatial organization of sources varies with frequency.

Thus, the observed EEG--MEG spectral difference could reflect both non-resistive filtering and geometric effects. The paper does not claim that geometry is irrelevant. Instead, it argues that the resistive-medium prediction fails and that future models should incorporate both realistic electromagnetic tissue properties and realistic three-dimensional source geometry.

The natural next step is a 3D forward model in which the source geometry, tissue compartments, and frequency-dependent impedances are explicitly varied. Such a model could test how much of the EEG--MEG spectral difference arises from non-resistive tissue properties, how much from source cancellation, and how much from spatial sensitivity differences.

---

## 12. Relation to local field potentials

Although the paper analyzes scalp EEG and MEG, the question is closely related to local field potentials.

LFPs are also extracellular signals. They are shaped by transmembrane currents, dendritic geometry, synaptic distributions, population correlations, and the electrical properties of the extracellular medium. If the medium is non-resistive at macroscopic scales, it is natural to ask whether similar filtering affects LFPs at mesoscopic and microscopic scales.

Previous theoretical work suggested that extracellular space can act as a low-pass or frequency-dependent filter. Such filtering can generate $1/f$-like spectra even when the underlying current sources do not themselves have that exact scaling. The present EEG/MEG comparison provides an independent macroscopic argument pointing in the same direction.

This matters for interpretation of broadband LFP power. A change in the LFP spectrum may reflect a change in neural dynamics, a change in the effective transfer properties of the medium, or both. In most experimental analyses, these factors are not separated.

A mature theory of field potentials should therefore combine:

1. biophysical source models;
2. realistic dendritic and population geometry;
3. extracellular impedance;
4. tissue compartment structure;
5. measurement-specific sensor physics.

The paper contributes to this broader program by showing that the resistive-medium simplification leaves a measurable spectral signature.

---

## 13. What the paper does not claim

It is useful to state the limits of the argument.

First, the study does not claim that the extracellular medium is arbitrarily complex or that resistive models are never useful. It claims that the effective medium cannot be fully described as a frequency-independent resistor if one wants to explain the observed EEG--MEG spectral difference.

Second, the study does not claim that all $1/f$-like structure in EEG is caused by tissue filtering. Neural source dynamics clearly matter. The claim is that the measured spectrum is shaped by both sources and medium, and that one cannot infer source dynamics from spectral scaling alone.

Third, the sample size was modest. The strength of the paper lies less in large-population inference and more in the combination of a physical prediction with simultaneous EEG/MEG measurements and extensive noise correction.

Fourth, very low frequencies may include non-neuronal contributions. This is a general challenge for scalp EEG. The paper discusses this issue and notes that invasive approaches could help isolate neural from non-neural contributions, though simultaneous invasive EEG and MEG would be technically difficult.

Fifth, the paper does not fully solve the inverse problem for a non-resistive brain. It identifies a physical inconsistency in the resistive assumption and points toward the need for frequency-dependent forward models.

These limitations are not weaknesses of the central argument. They define the next layer of the problem.

---

## 14. The broader message

The central message of the paper is that the physics of the recording medium matters.

EEG and MEG are often treated as complementary windows onto the same neural activity. That is true, but incomplete. They are also different physical observables. EEG measures electric potentials shaped by the conductive and dielectric properties of tissue. MEG measures magnetic fields generated by currents and filtered through a different physical pathway. If the brain and surrounding tissues were purely resistive, these two observables would share the same low-frequency scaling. They do not.

This suggests that the extracellular/head medium is not a passive, frequency-independent conduit. It is part of the measurement process. It shapes what we observe.

For neuroscience, this is a caution against overinterpreting spectra as direct neural signatures.

For physics, it is an invitation to treat brain electrophysiology as a problem in biological electromagnetic media, not only as a problem in signal analysis.

For computational neuroscience, it means that models of field potentials should not stop at the neural source. They must also model the path from source to sensor.

---

## 15. Closing perspective

The resistive-medium approximation has been enormously useful. It has made EEG, MEG, and LFP modeling mathematically tractable and practically productive. But useful approximations can become hidden assumptions. When they do, they need to be tested.

This paper tested one consequence of the resistive assumption: the predicted equality of low-frequency EEG and MEG scaling. The data did not support that prediction. EEG and MEG showed systematically different scaling exponents, and this difference persisted under multiple noise-correction strategies.

The interpretation is that the effective extracellular/head medium is non-resistive. Its impedance is frequency dependent, potentially reflecting capacitive and diffusive processes such as Warburg-like behavior. This means that the measured spectrum of brain activity is shaped not only by neural dynamics but also by the physical medium through which those dynamics are observed.

The result is not merely a technical point about EEG and MEG. It is a reminder that neural signals are physical signals. Their interpretation requires not only statistics and neurobiology, but also the physics of fields, media, and measurement.


## Citing

If you use this code or build on these ideas, please cite the paper using the
BibTeX entry above.
