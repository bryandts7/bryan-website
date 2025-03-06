// src/config/projects.ts
import bhinnekaLogo from '../assets/projects/bhinneka.png'
import effsegLogo from '../assets/projects/effseg.png'
import whisperLogo from '../assets/projects/whisper.png'


export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    githubUrl?: string;
    paperUrl?: string;
    demoUrl?: string;
    content?: string;
  }
  
  export const projects: Project[] = [
    {
      id: 'bhinneka',
      title: 'Bhinneka',
      description: 'A Multilingual LLM for Indonesian Regional Languages',
      imageUrl: bhinnekaLogo,
      technologies: ['Python', 'LoRA', 'HuggingFace'],
      content: `Indonesia is home to over 700 languages, many of which are at risk of marginalization and extinction. 
        Despite this linguistic diversity, there is a notable lack of high-performing LLMs tailored for Indonesia. 
        Additionally, the demand for mobile-compatible LLMs is high for digital applications in Indonesia. 
        To enhance accessibility for the Indonesian community, we created a dataset by translating existing 
        instruction datasets into multiple regional languages and fine-tuned
        an open-source LLM, based on Qwen-2.5 1.5B Instruct, to develop a multilingual
        LLM that supports English, Indonesian, and 8 regional languages. We evaluate
        the resulting model, Bhinneka 1.5B, on both discriminative and generative tasks.
        The results indicate that our model, despite its smaller size, can compete with
        larger models in Indonesia’s regional languages. `,
        paperUrl: 'https://drive.google.com/file/d/1ct052hR68AtbWI1vd70oe0qqErb78r9o/view',
        demoUrl: 'https://huggingface.co/richardcsuwandi/bhinneka'
    },
    {
      id: 'effseg',
      title: 'Efficient Semantic Segmentation',
      description: 'Knowledge Distillation utilizing Vision Transformer',
      imageUrl: effsegLogo,
      technologies: ['Python', 'Computer Vision', 'Knowledge Distillation'],
      content: `Accurate scene understanding is crucial for autonomous
        driving safety, with semantic segmentation being a key task.
        Vision Transformers (ViTs) outperform traditional CNNs

        but face challenges in real-time applications due to com-
        putational constraints. SegFormer combines efficient hier-
        archical feature extraction with a lightweight MLP decoder,

        yet its high-performance variant, SegFormer-B5, sacrifices
        speed for accuracy, while the lightweight SegFormer-B0 is
        faster but less accurate.

        This paper proposes a knowledge distillation frame-
        work using SegFormer-B5 as a teacher model to en-
        hance SegFormer-B0, improving segmentation accuracy

        while maintaining high inference speed. Incorporating pre-
        trained weights further boosts training efficiency and adapt-
        ability. Experiments on the Cityscapes and Mapillary Vis-
        tas dataset validate the method's effectiveness, achieving

        a strong balance between performance and efficiency for
        real-time semantic segmentation.`,
      paperUrl: 'https://drive.google.com/file/d/19t2ndm7cFX7UfP49gGHYa-tEq8PbVrL8/view'
    },
    {
      id: 'whisper',
      title: 'Indian-Whisper',
      description: 'Fine-Tuning OpenAI Whisper for Enhanced Recognition of Indian-Accented English in ASR',
      imageUrl: whisperLogo,
      technologies: ['Python', 'ASR', 'HuggingFace'],
      content: `Automatic Speech Recognition (ASR) systems are integral to modern applications,
        yet they often struggle with diverse accents, particularly Indian-accented English,
        which is shaped by unique phonetics, rhythms, and intonations. This project
        addresses this challenge by fine-tuning OpenAI's Whisper model, a state-of-the-
        art ASR system pre-trained on multilingual datasets, using the Svarah dataset—a
        curated collection of Indian-accented English audio. The goal was to adapt Whisper
        for improved transcription accuracy in this domain, evaluated through the Word
        Error Rate (WER) metric. Fine-tuning involved preprocessing the dataset to
        ensure compatibility with the model's input requirements, followed by targeted
        training using advanced techniques such as gradient accumulation. The base
        model (whisper-base) achieved an initial WER of 33.25%, which was reduced
        to 16.31% after fine-tuning—a relative improvement of approximately 51%. This
        significant enhancement highlights the effectiveness of fine-tuning in adapting ASR
        models to specific accents. The project not only demonstrated the feasibility of
        improving ASR systems for Indian English but also revealed specific error patterns
        and limitations, such as challenges with noisy or heavily accented speech.`,
      paperUrl: 'https://drive.google.com/file/d/12RfIH9noWZHnJs6gl8VtyK0rvORISVe9/view',
      demoUrl: 'https://huggingface.co/spaces/bryandts/whisper-english-india-accent'
    },
    // Add more projects
  ];