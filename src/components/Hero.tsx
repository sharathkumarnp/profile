import React, { useRef, useEffect } from "react";

export function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Parallax Tilt Effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      card.style.transform = `rotateX(${y * -20}deg) rotateY(${x * 20}deg)`;
    };

    const reset = () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", reset);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
      <section
          className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6"
          style={{
            backgroundImage: "url('https://github-sharathkumar.s3.us-east-1.amazonaws.com/pexels-fbo-media-535159577-30269288.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            perspective: "1000px"
          }}
      >
        {/* Glass Card */}
        <div className="relative z-10 max-w-4xl w-full rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Shimmer Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:animate-[shimmer_2s_infinite] before:blur-lg" />

          <div
              ref={cardRef}
              className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-10 transition-transform duration-300"
          >
            <div className="text-center text-white">
              <img
                  src="https://github-sharathkumar.s3.us-east-1.amazonaws.com/profile_image.jpg?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Sharath Kumar"
                  className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/20 shadow-lg"
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans mt-6 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 text-transparent bg-clip-text">
                Sharath Kumar
              </h1>
              <p className="text-md sm:text-lg text-yellow-300/95 mt-2 font-serif">Site Reliability Engineer</p>
              <p className="mt-4 text-white/90 max-w-xl mx-auto text-sm sm:text-base">
                Passionate about building scalable and reliable systems using cloud-native technologies, infrastructure automation, and DevOps best practices.
              </p>

              <div className="mt-6 flex justify-center flex-wrap gap-4">
                <a
                    href="#contact"
                    className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
                >
                  Connect 🙋🏻‍♂️
                </a>
                <a
                    href="#projects"
                    className="px-6 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
                >
                  Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
