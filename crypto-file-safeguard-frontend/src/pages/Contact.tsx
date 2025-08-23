import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Shield, Send } from "lucide-react";
import React from "react";
import api from "@/services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/contact", formData);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-white" />,
      title: "Email Support",
      description: "Get help with your account and technical issues",
      contact: "support@securevault.com",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      title: "General Inquiries",
      description: "Questions about our services and pricing",
      contact: "info@securevault.com",
    },
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Security Issues",
      description: "Report security vulnerabilities or concerns",
      contact: "security@securevault.com",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions about SecureVault? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="h-fit bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Send className="h-6 w-6" />
                <span>Send us a Message</span>
              </CardTitle>
              <CardDescription>
                Fill out the form and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-300"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-300"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-300"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-300"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* --- THIS SECTION HAS BEEN ADDED BACK --- */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              Other Ways to Reach Us
            </h2>
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors"
              >
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-gray-700 p-3 rounded-lg">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{info.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {info.description}
                    </p>
                    <p className="text-blue-400 font-medium mt-2">
                      {info.contact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-400">
                <div>
                  <h4 className="font-medium text-white mb-1">
                    How secure are my files?
                  </h4>
                  <p>
                    Files are encrypted with AES-256 before being stored on
                    IPFS.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">
                    Can I recover deleted files?
                  </h4>
                  <p>
                    The record of your file on the blockchain is permanent,
                    allowing for recovery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
