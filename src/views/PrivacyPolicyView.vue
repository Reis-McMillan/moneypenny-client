<script setup>
import AppLayout from '../components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto p-8 space-y-6">
      <header>
        <h1 class="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p class="text-xs text-gray-500">Last updated: 2026-05-07</p>
      </header>

      <section>
        <h2 class="text-xl font-semibold text-white mt-2 mb-3">1. Introduction</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          This Privacy Policy describes how Moneypenny ("Moneypenny," "we," "us," or "our") collects, uses, and shares
          information when you use our AI email assistant service (the "Service"). By using the Service, you agree to
          the practices described in this Policy.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">2. Information We Collect</h2>
        <p class="text-sm text-gray-300 leading-relaxed mb-3">
          We collect the following categories of information:
        </p>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li><strong class="text-white">Account information.</strong> Your name, email address, and authentication identifiers from your sign-in provider.</li>
          <li><strong class="text-white">Connected email account credentials.</strong> OAuth tokens you grant when linking Gmail, Outlook, or other email providers. We do not see or store your email password.</li>
          <li><strong class="text-white">Email content.</strong> Messages, metadata (sender, recipient, subject, timestamps), attachments, and labels from email accounts you connect, ingested so the Service can answer questions and draft replies.</li>
          <li><strong class="text-white">Chat content.</strong> Messages you send to the Moneypenny chat interface and the AI-generated responses.</li>
          <li><strong class="text-white">Usage data.</strong> Logs of feature usage, IP address, browser type, and diagnostic information used to operate and secure the Service.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">3. How We Use Your Information</h2>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li>Provide the Service: ingest your email, generate drafts, answer questions about your inbox, and surface relevant context.</li>
          <li>Authenticate you and maintain your session.</li>
          <li>Monitor service health, prevent abuse, and improve reliability.</li>
          <li>Communicate with you about your account or material changes to the Service.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">4. How We Share Information</h2>
        <p class="text-sm text-gray-300 leading-relaxed mb-3">
          We do not sell your personal information. We share information only as described below:
        </p>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li><strong class="text-white">Sub-processors.</strong> We rely on cloud infrastructure providers and AI processing providers to operate the Service. These vendors are bound by contractual confidentiality and data-protection obligations.</li>
          <li><strong class="text-white">Email providers.</strong> Communication with Gmail, Outlook, or other connected providers is performed on your behalf using the OAuth scopes you authorize.</li>
          <li><strong class="text-white">Legal compliance.</strong> We may disclose information if required by law, subpoena, or to protect rights, safety, or property.</li>
          <li><strong class="text-white">Business transfers.</strong> In a merger, acquisition, or asset sale, information may transfer to the successor entity, subject to this Policy.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">5. Data Retention</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          We retain ingested email content and chat history for as long as your account is active or as needed to
          provide the Service. When you disconnect an email account or delete your Moneypenny account, we delete the
          associated ingested content within a reasonable period, except where retention is required by law or for
          legitimate operational reasons (e.g., backups, fraud prevention).
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">6. Your Rights and Choices</h2>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2 ml-2">
          <li>Access, correct, or delete your account information.</li>
          <li>Disconnect any linked email account at any time from the Accounts page, which revokes our access tokens.</li>
          <li>Revoke OAuth grants directly through your email provider's security settings.</li>
          <li>Request deletion of your account and associated ingested data.</li>
        </ul>
        <p class="text-sm text-gray-300 leading-relaxed mt-3">
          Depending on your jurisdiction, you may have additional rights under applicable privacy laws (e.g., GDPR, CCPA).
          Contact us to exercise these rights.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">7. Security</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          We use industry-standard technical and organizational measures to protect your information, including
          encryption in transit, encryption at rest for sensitive data, access controls, and audit logging. No system is
          perfectly secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">8. Children's Privacy</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          The Service is not directed to children under 18. We do not knowingly collect personal information from
          children. If you believe a child has provided us information, please contact us so we can delete it.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">9. International Users</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          The Service may be operated from the United States or other jurisdictions. By using the Service, you consent
          to the transfer of your information to those jurisdictions, which may have different data-protection laws than
          your own.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">10. Changes to This Policy</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          We may update this Policy from time to time. We will post the revised Policy with a new "Last updated" date
          and, where appropriate, notify you of material changes.
        </p>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-white mt-8 mb-3">11. Contact Us</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          Questions or requests related to this Policy can be sent to
          <a href="mailto:reis@mcmlln.dev" class="text-indigo-400 hover:text-indigo-300">reis@mcmlln.dev</a>.
        </p>
      </section>
    </div>
  </AppLayout>
</template>
