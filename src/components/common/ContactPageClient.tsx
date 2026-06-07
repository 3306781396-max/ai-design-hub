"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { Mail, Twitter, Github, Linkedin, Youtube } from "lucide-react";
import { MoreLink } from "@/components/ui/more-link";

export function ContactPageClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 gradient-text">
          {t("pages.contact.heading")}
        </h1>

        <div className="space-y-12 text-dark-300 leading-relaxed">
          <section>
            <p className="text-lg mb-8">
              {t("pages.contact.subtitle")}
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-white">
                {t("pages.contact.form_title")}
              </h2>
              <form className="space-y-6" action="#">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-dark-200 mb-2"
                  >
                    {t("pages.contact.name_label")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder={t("pages.contact.name_placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-dark-200 mb-2"
                  >
                    {t("pages.contact.email_label")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary transition-colors"
                    placeholder={t("pages.contact.email_placeholder")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-dark-200 mb-2"
                  >
                    {t("pages.contact.subject_label")}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-800 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">
                      {t("pages.contact.subject_placeholder")}
                    </option>
                    <option value="general">
                      {t("pages.contact.subject_general")}
                    </option>
                    <option value="tool-submission">
                      {t("pages.contact.subject_tool")}
                    </option>
                    <option value="partnership">
                      {t("pages.contact.subject_partner")}
                    </option>
                    <option value="bug-report">
                      {t("pages.contact.subject_bug")}
                    </option>
                    <option value="feature-request">
                      {t("pages.contact.subject_feature")}
                    </option>
                    <option value="other">
                      {t("pages.contact.subject_other")}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-dark-200 mb-2"
                  >
                    {t("pages.contact.message_label")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-800 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder={t("pages.contact.message_placeholder")}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t("pages.contact.send_button")}
                </button>

                <p className="text-sm text-dark-400 text-center">
                  {t("pages.contact.form_note")}
                </p>
              </form>
            </section>

            {/* Contact Info Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-white">
                {t("pages.contact.ways_title")}
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {t("pages.contact.email_title")}
                      </h3>
                    </div>
                  </div>
                  <MoreLink
                    href="mailto:hello@aidesignhub.com"
                    className="text-primary hover:underline"
                  >
                    {t("pages.contact.email_addr")}
                  </MoreLink>
                  <p className="text-sm text-dark-400 mt-2">
                    {t("pages.contact.email_time")}
                  </p>
                </div>

                {/* Social Media */}
                <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                  <h3 className="text-lg font-medium text-white mb-4">
                    {t("pages.contact.social_title")}
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://twitter.com/aidesignhub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-dark-300 hover:text-primary transition-colors"
                    >
                      <Twitter className="text-xl" />
                      <span>@aidesignhub on Twitter</span>
                    </a>
                    <a
                      href="https://github.com/aidesignhub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-dark-300 hover:text-primary transition-colors"
                    >
                      <Github className="text-xl" />
                      <span>github.com/aidesignhub</span>
                    </a>
                    <a
                      href="https://linkedin.com/company/aidesignhub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-dark-300 hover:text-primary transition-colors"
                    >
                      <Linkedin className="text-xl" />
                      <span>linkedin.com/company/aidesignhub</span>
                    </a>
                    <a
                      href="https://youtube.com/@aidesignhub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-dark-300 hover:text-primary transition-colors"
                    >
                      <Youtube className="text-xl" />
                      <span>youtube.com/@aidesignhub</span>
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                  <h3 className="text-lg font-medium text-white mb-3">
                    {t("pages.contact.response_title")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        <strong className="text-white">
                          {t("pages.contact.response_general")}
                        </strong>{" "}
                        {t("pages.contact.response_general_time")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        <strong className="text-white">
                          {t("pages.contact.response_tool")}
                        </strong>{" "}
                        {t("pages.contact.response_tool_time")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        <strong className="text-white">
                          {t("pages.contact.response_partner")}
                        </strong>{" "}
                        {t("pages.contact.response_partner_time")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>
                        <strong className="text-white">
                          {t("pages.contact.response_bug")}
                        </strong>{" "}
                        {t("pages.contact.response_bug_time")}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
