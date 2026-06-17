import React from "react";
import Navbar from "../Layout/Navbar";
import Hero from "../Section/Hero";
import About from "../Section/About";
import Experience from "../Section/Experience";
import Tech from "../Section/Tech";
import Certificate from "../Section/Certificate";
import Project from "../Section/Project";
import Contact from "../Section/Contact";

const Portfolio: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Tech />
      <Certificate />
      <Project />
      <Contact />
    </>
  );
};

export default Portfolio;
