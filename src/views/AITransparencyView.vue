<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto p-8 space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-white mb-2">AI Transparency</h1>
        <p class="text-xs text-gray-500">Last updated: 2026-05-07</p>
      </header>

      <section>
        <h2 class="text-xl font-semibold text-white mt-2 mb-3">Overview</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Moneypenny is an AI-assisted email tool. We believe you should understand how the AI behind it works, what it
          can and cannot do, and what choices you have. This page summarizes our current approach. We will update it as
          the Service evolves.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">How the AI Works</h2>
        <p class="text-sm text-gray-300 leading-relaxed mb-3">
          Moneypenny uses third-party large language models (LLMs) to interpret your messages, retrieve relevant context
          from your connected email accounts, and generate responses or draft emails on your behalf. At a high level:
        </p>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li>When you send a chat message, the system fetches relevant context from your ingested email and combines it with your prompt.</li>
          <li>The combined prompt is sent to an LLM provider, which produces a response or draft.</li>
          <li>The response is returned to your client and displayed to you for review.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Limitations</h2>
        <p class="text-sm text-gray-300 leading-relaxed mb-3">
          AI systems have meaningful limitations you should be aware of:
        </p>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li><strong class="text-white">Hallucinations.</strong> The AI may generate information that sounds plausible but is incorrect, outdated, or fabricated. Always verify factual claims before relying on them.</li>
          <li><strong class="text-white">Tone and intent.</strong> Drafts may misjudge tone, miss nuance, or include phrasing that does not match your voice or relationship with the recipient.</li>
          <li><strong class="text-white">Context gaps.</strong> The AI only sees what is retrieved at the time of the request. It may miss recent messages, attachments, or off-platform context.</li>
          <li><strong class="text-white">Not professional advice.</strong> Output is not legal, medical, financial, or other professional advice. Do not act on it as if it were.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Human Oversight</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Moneypenny does not send emails on your behalf without your explicit confirmation. Drafts are presented in the
          interface for you to review, edit, and approve before any message is sent. You are responsible for the content
          of any message you send.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Training Data</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          We do not use your email content or chat conversations to train or fine-tune the AI models that power
          Moneypenny. Our LLM providers process your data only to generate responses for your specific request, and we
          contractually require them to honor the same restriction.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Bias and Fairness</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Large language models can reflect biases present in their training data. This may affect how the AI describes
          people, summarizes messages, or phrases drafts. We work to reduce harmful bias through prompt design and
          choice of provider, but bias cannot be fully eliminated. If you encounter problematic output, please report it.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Security and Confidentiality</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Email content sent to AI providers as part of generating a response is transmitted over encrypted channels and
          handled under contractual data-protection terms. See the Privacy Policy for additional detail on how we
          handle your data.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Your Controls</h2>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li>Review and edit every AI-generated draft before sending.</li>
          <li>Disconnect any linked email account at any time from the Accounts page.</li>
          <li>Delete your chat history or your entire Moneypenny account.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">Reporting Issues</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          If you see AI behavior that seems inaccurate, biased, unsafe, or otherwise concerning, please report it to
          <a href="mailto:reis@mcmlln.dev" class="text-indigo-400 hover:text-indigo-300">reis@mcmlln.dev</a>.
          Reports help us improve the Service.
        </p>
      </section>
    </div>
  </AppLayout>
</template>
