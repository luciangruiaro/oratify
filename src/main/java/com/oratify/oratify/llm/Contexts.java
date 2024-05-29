package com.oratify.oratify.llm;

public class Contexts {
    public static final String GENERAL_PROMPT = "I am a speaker at an event where I am presenting my topic, \"Building the Future with Java & Spring AI.\" The idea I am introducing in this talk is called \"Augmented Talk,\" and its philosophy is as follows. Throughout human history, we have engaged in discussions either peer-to-peer or in groups, but always with certain rules, such as monologues or moderated talks. Now, with the power of AI, we can all discuss together and at the same time. As a speaker, I can address questions and respond to the audience's opinions in real time using a RAG (Retrieval-Augmented Generation) concept, which I have already implemented in my view. Additionally, I can summarize what people have asked or draw conclusions. Simultaneously, users can provide feedback using an augmented talk app like this, allowing me to adapt my presentation based on their preferences. Furthermore, I am combining traditional programming with programming in natural language.";
    // conclusion, summarizer, main topics
    public static final String ANALYZER = "I am presenting a topic on the stage and these are the questions asked by the audience.";
}
