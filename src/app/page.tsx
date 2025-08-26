"use client";
import { useState } from 'react';
import Image from "next/image";
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Award, Calendar, User, Briefcase, FileText } from 'lucide-react';
import profilePic from '../assets/profile.jpg';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'blog', label: 'Blog', icon: FileText }
  ];

  const projects = [
    {
      id: 1,
      title: "Smart Home Automation System",
      description: "An intelligent IoT-based home automation platform with AI-powered energy optimization, voice control, and predictive maintenance capabilities.",
      technologies: ["Python", "TensorFlow", "Arduino", "MQTT"],
      image: "https://via.placeholder.com/400x250/6366f1/ffffff?text=Smart+Home+IoT",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "AI-Powered Crop Monitoring",
      description: "IoT sensor network with machine learning models for precision agriculture, providing real-time crop health monitoring and yield prediction.",
      technologies: ["PyTorch", "Raspberry Pi", "LoRaWAN", "Computer Vision"],
      image: "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=AI+Agriculture",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "Industrial Predictive Maintenance",
      description: "AI-driven predictive maintenance system using IoT sensors to monitor industrial equipment and predict failures before they occur.",
      technologies: ["Scikit-learn", "Edge Computing", "InfluxDB", "Grafana"],
      image: "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Industrial+AI",
      github: "#",
      demo: "#"
    }
  ];

  const certificates = [
    {
      id: 1,
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "2024",
      image: "https://via.placeholder.com/300x200/ff6b35/ffffff?text=TensorFlow+Certified",
      credentialId: "TF-12345"
    },
    {
      id: 2,
      title: "AWS IoT Core Certification",
      issuer: "Amazon Web Services",
      date: "2023",
      image: "https://via.placeholder.com/300x200/61dafb/ffffff?text=AWS+IoT+Certified",
      credentialId: "AWS-67890"
    },
    {
      id: 3,
      title: "Machine Learning Engineering",
      issuer: "Coursera",
      date: "2023",
      image: "https://via.placeholder.com/300x200/0a0a23/ffffff?text=ML+Engineering",
      credentialId: "COURSERA-11111"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Building Edge AI Solutions for IoT Devices",
      excerpt: "Learn how to deploy machine learning models on edge devices for real-time IoT applications with minimal latency...",
      date: "2024-08-15",
      readTime: "8 min read",
      tags: ["Edge AI", "IoT", "Machine Learning"]
    },
    {
      id: 2,
      title: "The Future of AI in Industrial IoT",
      excerpt: "Exploring how artificial intelligence is transforming industrial IoT systems and enabling predictive maintenance...",
      date: "2024-08-01",
      readTime: "6 min read",
      tags: ["AI", "Industrial IoT", "Industry 4.0"]
    },
    {
      id: 3,
      title: "Optimizing Neural Networks for Embedded Systems",
      excerpt: "A comprehensive guide to model compression techniques and optimization strategies for deploying AI on resource-constrained devices...",
      date: "2024-07-20",
      readTime: "12 min read",
      tags: ["Neural Networks", "Embedded AI", "Optimization"]
    }
  ];

  const renderHome = () => (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden flex flex-col justify-center">
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 py-4">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <Image
            src={profilePic}
            alt="Profile"
            width={192}
            height={192}
            className="rounded-full mx-auto mb-4 mt-4 border-2 border-white shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Hi, I&apos;m <span className="text-blue-600">Nabil</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-3">
            AI & IoT Engineer
          </p>
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            I build intelligent AI systems and IoT solutions, with a focus on computer vision, machine learning, and hands-on hardware and software development.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 mb-6">
          <a href="https://github.com/nabilsaragih" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/nabilsaragih/" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:mnabilsaragih@gmail.com" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setActiveSection('projects')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
        >
          View My Work
          <ChevronDown className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here are some of my recent projects that showcase AI and IoT system development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <a
                    href={project.github}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Certifications</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional certifications that validate my expertise in various technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Image
                src={cert.image}
                alt={cert.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{cert.title}</h3>
                <p className="text-gray-600 mb-3 font-medium">{cert.issuer}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{cert.date}</span>
                </div>
                <p className="text-sm text-gray-500 font-mono">
                  Credential ID: {cert.credentialId}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBlog = () => (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Insights about AI engineering, IoT development, and emerging technologies.
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 lg:mb-0">
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </a>
                </h3>
                <div className="flex items-center text-gray-500 space-x-6">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">{post.excerpt}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <a
                href="#"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors"
              >
                Read More
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return renderHome();
      case 'projects':
        return renderProjects();
      case 'certificates':
        return renderCertificates();
      case 'blog':
        return renderBlog();
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-md shadow-xl z-50 flex flex-col border-r border-gray-200">
        <div className="p-8">
          <h1 className="font-bold text-2xl text-gray-900">Nabil Saragih</h1>
          <p className="text-sm text-gray-600 mt-1">AI & IoT Engineer</p>
        </div>

        <div className="flex-1 flex flex-col space-y-2 px-6">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-blue-600 bg-blue-50 shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className={`ml-64 ${activeSection === 'home' ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto'}`}>
        {renderContent()}
      </main>
    </div>
  );
}
