// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Check, ChevronLeft, ChevronRight } from "lucide-react";

// // Using placeholder images since assets don't exist
// // Replace these with actual images in /public folder when available
// const chefImg = "/chef.jpg";
// const chef2Img = "/chef2.jpg";
// const chef3Img = "/chef3.jpg";
// const restaurantImg = "/restaurant.png";

// const highlights = [
//   "Freshly Prepared, Hygienic Meals",
//   "Premium Ambience & Comfortable Dining",
//   "Fast Service Near KIIT.",
//   "Affordable food Perfect for Students & Families",
//   "Taste That Brings Smiles.",
// ];

// interface Chef {
//   image: string;
//   name: string;
//   role: string;
//   bio: string;
// }

// const chefs: Chef[] = [
//   {
//     image: "/chef1.png",
//     name: "Chef Rajveer",
//     role: "Head Chef",
//     bio: "Chef Rajveer is the heart of our kitchen, bringing the warmth of ‘ghar ka khana’ to every plate. With years of culinary experience and a passion for authentic Indian flavors, he ensures that every dish at ARF feels homemade, comforting, and full of love. His dedication to hygiene, quality ingredients, and traditional recipes makes every meal both delicious and memorable.",
//   },
//   {
//     image: "/manager.png",
//     name: "Arun",
//     role: "Manager",
//     bio: "Arun is the backbone of Addis Royal Food’s daily operations. With his calm leadership and friendly personality, he ensures smooth service, customer satisfaction, and a welcoming dining experience. His focus on quality service, timely delivery, and team coordination helps ARF maintain its royal standards every single day.",
//   },
//   {
//     image: "/owner.png",
//     name: "Sibhu Das",
//     role: "Owner",
//     bio: "Sibhu Das is the visionary behind Addis Royal Food. Driven by passion and dedication, he built ARF with a mission to provide hygienic, affordable, and flavorful meals near KIIT. His commitment to excellence, customer trust, and consistent quality continues to shape ARF into a brand known for both royal taste and warm hospitality.",
//   },
// ];


// const AboutUs = () => {
//   const [activeChef, setActiveChef] = useState(0);

//   const prevChef = () =>
//     setActiveChef((prev) => (prev === 0 ? chefs.length - 1 : prev - 1));
//   const nextChef = () =>
//     setActiveChef((prev) => (prev === chefs.length - 1 ? 0 : prev + 1));

//   const chef = chefs[activeChef];

//   return (
//     <section className="w-full bg-[#E5A83E] py-16 md:py-24 ">
//       <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
//         {/* Restaurant Image Side */}
//         <div className="flex justify-center">
//           <div className="relative w-full max-w-[500px]">
//             <div className="overflow-hidden rounded-2xl shadow-xl">
//               <img
//                 src="/resturant.png"
//                 alt="Tacos My Güey restaurant interior"
//                 className="w-full h-[300px] md:h-[380px] object-cover"
//                 loading="lazy"
//               />
//             </div>
//             {/* Decorative dots */}
//             <div className="absolute -top-4 -right-4 w-16 h-16 grid grid-cols-4 gap-1 opacity-40">
//               {Array.from({ length: 16 }).map((_, i) => (
//                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-tmg-red" />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Text Side */}
//         <div className="flex flex-col">
//           <h2 className="font-display font-display text-8xl md:text-6xl tracking-wide text-black leading-tight mb-4">
//             ABOUT <span className="text-[#d8232a]">ADDIS ROYAL FOOD</span> 
//           </h2>
//           <p className="font-light text-black leading-relaxed mb-6">
//            At Addis Royal Food (ARF), we serve rich flavors and royal hospitality near KIIT University. From North Indian classics to Indo-Chinese favorites and student combos, every meal is freshly prepared, hygienic, and affordable — with fast service and taste that keeps you coming back.<br/>
// <span className="font-bold  ">{" "} Visit us at: </span>
// <br/> <span className="font-body">📍Addis Royal Food (ARF)
//  Behind Royal enfield,<br/>KIIT Road, Near KIIT University
// Patia, Bhubaneswar, Odisha – 751024</span>

//           </p>

//           {/* Highlights */}
//           <ul className="space-y-3 mb-8">
//             {highlights.map((item) => (
//               <li key={item} className="flex items-center gap-3">
//                 <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#d8232a]">
//                   <Check className="w-3.5 h-3.5 text-primary-foreground" />
//                 </span>
//                 <span className="font-body text-black font-medium text-sm md:text-base">
//                   {item}
//                 </span>
//               </li>
//             ))}
//           </ul>

//           <a
//             href="https://share.google/KCW5KZYiOF7RbwWg0"
//             className="inline-block self-start font-display  text-sm md:text-base tracking-[0.15em] uppercase bg-primary text-primary-foreground px-10 py-4 rounded-full hover:opacity-90 transition-opacity duration-300"
//           >
//             visit us
//           </a>
//         </div>
//       </div>

//       {/* Know Your Chef Sub-section */}
//       <div className=" bg-secondary px-10 max-w-full mx-auto mt-20 md:mt-28">
//         <h3 className="font-display  text-8xl md:text-7xl sm:text-3xl tracking-wide text-primary text-center mb-4">
//           THE HEART OF ARF
//         </h3>
//         <p className="font-display text-3xl tracking-[0.25em] text-muted-foreground uppercase text-center mb-12">
//           Leadership & Culinary Excellence
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
//           {/* Text side with bio */}
//           <div className="flex flex-col">
//             <h4 className="font-display font-bold text-xl md:text-2xl text-foreground mb-1 transition-all duration-300">
//               {chef.name}
//             </h4>
//             <p className="font-display text-sm text-tmg-red tracking-wide uppercase mb-4">
//               {chef.role}
//             </p>
//             <p className="font-body text-muted-foreground leading-relaxed">
//               {chef.bio}
//             </p>
//           </div>

//           {/* Chef image with toggle arrows */}
//           <div className="flex items-center justify-center gap-4">
//             {/* Left arrow */}
//             <button
//               onClick={prevChef}
//               className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md"
//               aria-label="Previous chef"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>

//             {/* Rounded chef frame */}
//             <div className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px]">
//               {/* Decorative rings */}
//               <div className="absolute inset-0 rounded-full border-[3px] border-tmg-red/30 scale-110" />
//               <div className="absolute inset-0 rounded-full border-[3px] border-tmg-green/30 scale-[1.05] rotate-12" />
//               {/* Chef image */}
//               <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl">
//                 <img
//                   src={chef.image}
//                   alt={chef.name}
//                   className="w-full h-full object-cover transition-all duration-500"
//                   loading="lazy"
//                 />
//               </div>
//               {/* Name badge */}
//               <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-2 rounded-full shadow-lg text-center whitespace-nowrap">
//                 <p className="font-display  text-sm">{chef.name}</p>
//               </div>
//             </div>

//             {/* Right arrow */}
//             <button
//               onClick={nextChef}
//               className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md"
//               aria-label="Next chef"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Dots indicator */}
//         <div className="flex justify-center gap-2 mt-8">
//           {chefs.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setActiveChef(i)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 i === activeChef ? "bg-primary scale-110" : "bg-muted-foreground/30"
//               }`}
//               aria-label={`View chef ${i + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutUs; 
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

/* ================== GLOBAL VIDEO CONTROL ================== */
let currentlyPlayingVideo: HTMLVideoElement | null = null;

const Reel = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    if (
      currentlyPlayingVideo &&
      currentlyPlayingVideo !== videoRef.current
    ) {
      currentlyPlayingVideo.pause();
    }
    currentlyPlayingVideo = videoRef.current;
  };

  return (
    <video
      ref={videoRef}
      src={src}
      className="
        w-full
        h-[500px]
        sm:h-[550px]
        md:h-[600px]
        lg:h-[650px]
        xl:h-[700px]
        object-cover
        rounded-3xl
        shadow-2xl
      "
      muted
      loop
      controls
      onPlay={handlePlay}
    />
  );
};

/* ================== DATA ================== */

const highlights = [
  "Freshly Prepared, Hygienic Meals",
  "Premium Ambience & Comfortable Dining",
  "Fast Service Near KIIT.",
  "Affordable food Perfect for Students & Families",
  "Taste That Brings Smiles.",
];

interface Chef {
  image: string;
  name: string;
  role: string;
  bio: string;
}

const chefs: Chef[] = [
  {
    image: "/owner.png",
    name: "Sibhu Das",
    role: "Owner",
    bio: "Sibhu Das is the visionary behind Addis Royal Food. Driven by passion and dedication, he built ARF with a mission to provide hygienic, affordable, and flavorful meals near KIIT.",
  },
  {
    image: "/chef1.png",
    name: "Chef Rajveer",
    role: "Head Chef",
    bio: "Chef Rajveer is the heart of our kitchen, bringing the warmth of ghar ka khana to every plate.",
  },
  {
    image: "/manager.png",
    name: "Arun",
    role: "Manager",
    bio: "Arun ensures smooth service, customer satisfaction, and a welcoming dining experience.",
  },
];

/* ================== COMPONENT ================== */

export function AboutUs() {
  const [activeChef, setActiveChef] = useState(0);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  /* REEL CAROUSEL STATE */
  const reels = [
    "/resturantvid.mp4",
    "/resturantvid2.mp4",
    "/resturantvid3.mp4",
  ];

  const [activeReel, setActiveReel] = useState(0);

  const prevReel = () =>
    setActiveReel((prev) => (prev === 0 ? reels.length - 1 : prev - 1));

  const nextReel = () =>
    setActiveReel((prev) => (prev === reels.length - 1 ? 0 : prev + 1));

  const prevChef = () =>
    setActiveChef((prev) => (prev === 0 ? chefs.length - 1 : prev - 1));

  const nextChef = () =>
    setActiveChef((prev) => (prev === chefs.length - 1 ? 0 : prev + 1));

  const chef = chefs[activeChef];

  return (
    <section id="aboutUs" className="w-full bg-[#E5A83E] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">

          {/* ================= MEDIA SECTION ================= */}
          <div className="flex justify-center order-2 md:order-1">
            <div className="relative w-full">

              <div className="overflow-hidden rounded-3xl shadow-xl relative p-4 bg-white/10">

                {/* IMAGE MODE */}
                {mediaType === "image" && (
                  <Image
                    src="/resturant.png"
                    alt="Addis Royal Food"
                    width={800}
                    height={650}
                    className="w-full h-[650px] object-cover rounded-3xl"
                  />
                )}

                {/* VIDEO MODE (CAROUSEL) */}
                {mediaType === "video" && (
                  <div className="flex items-center justify-center gap-4">

                    <button
                      onClick={prevReel}
                      className="w-10 h-10 rounded-full bg-[#d8232a] text-white flex items-center justify-center shadow-md hover:brightness-110 transition"
                    >
                      <ChevronLeft />
                    </button>

                    <Reel src={reels[activeReel]} />

                    <button
                      onClick={nextReel}
                      className="w-10 h-10 rounded-full bg-[#d8232a] text-white flex items-center justify-center shadow-md hover:brightness-110 transition"
                    >
                      <ChevronRight />
                    </button>

                  </div>
                )}

                {/* TOGGLE BUTTONS */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => setMediaType("image")}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                      mediaType === "image"
                        ? "bg-[#d8232a] text-white"
                        : "bg-white/80 text-black"
                    }`}
                  >
                    Image
                  </button>

                  <button
                    onClick={() => setMediaType("video")}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition ${
                      mediaType === "video"
                        ? "bg-[#d8232a] text-white"
                        : "bg-white/80 text-black"
                    }`}
                  >
                    Reels
                  </button>
                </div>

              </div>
            </div>
          </div>


          {/* ──────────────── Text Side ──────────────── */}
          <div className="flex flex-col order-1 md:order-2">
            <h2 className="font-display text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-black leading-tight mb-4 md:mb-6">
              ABOUT{" "}
              <span className="text-[#d8232a]">ADDIS ROYAL FOOD</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed mb-6 md:mb-8 font-light">
              At Addis Royal Food (ARF), we serve rich flavors and royal hospitality near KIIT University. From North Indian classics to Indo-Chinese favorites and student combos, every meal is freshly prepared, hygienic, and affordable — with fast service and taste that keeps you coming back.
              <br />
              <br />
              <span className="font-bold">Visit us at:</span>
              <br />
              <span className="font-extralight">
                📍 Addis Royal Food (ARF)
                <br />
                Behind Royal Enfield, KIIT Road,
                <br />
                Near KIIT University, Patia,
                <br />
                Bhubaneswar, Odisha – 751024
              </span>
            </p>

            {/* Highlights */}
            <ul className="space-y-3 sm:space-y-4 mb-6 md:mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 sm:gap-3">
                  <span className="flex shrink-0 items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#d8232a]">
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  </span>
                  <span className="font-medium text-black text-sm sm:text-base md:text-lg">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="https://share.google/KCW5KZYiOF7RbwWg0"
              className="inline-flex items-center justify-center font-medium text-sm sm:text-base tracking-wider uppercase bg-[#d8232a] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full hover:brightness-110 transition md:self-start shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Us
            </a>
          </div>
        </div>
      </div>

      {/* ──────────────── Know Your Chef Section ──────────────── */}
      <div className="mt-16 sm:mt-20 md:mt-24 lg:mt-28 bg-secondary px-5 sm:px-6 md:px-10 py-12 md:py-16">
        <div className="mx-auto max-w-screen-xl">
          <h3 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-[#d8232a] text-center mb-3 md:mb-4">
            THE HEART OF ARF
          </h3>
          <p className="text-base sm:text-lg md:text-xl tracking-wide text-gray-700 uppercase text-center mb-10 md:mb-14 font-medium">
            Leadership & Culinary Excellence
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Bio – order first on mobile */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <h4 className="font-bold text-xl sm:text-2xl md:text-3xl text-black mb-1.5 md:mb-2 transition-all">
                {chef.name}
              </h4>
              <p className="text-sm sm:text-base font-medium uppercase tracking-wide text-[#d8232a] mb-4 md:mb-6">
                {chef.role}
              </p>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg">
                {chef.bio}
              </p>
            </div>

            {/* Chef carousel – order second on mobile */}
            <div className="order-1 md:order-2 flex items-center justify-center gap-3 sm:gap-4 lg:gap-6">
              <button
                onClick={prevChef}
                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#d8232a] text-white hover:brightness-110 transition shadow-md"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                {/* Decorative rings – scale down on mobile */}
                <div className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-red-600/30 scale-110" />
                <div className="absolute inset-0 rounded-full border-2 sm:border-[3px] border-green-600/30 scale-[1.06] rotate-12" />

                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={chef.image}
                    alt={chef.name}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-[#d8232a] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg text-sm sm:text-base font-medium whitespace-nowrap">
                  {chef.name}
                </div>
              </div>

              <button
                onClick={nextChef}
                className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#d8232a] text-white hover:brightness-110 transition shadow-md"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Dots – bigger touch targets on mobile */}
          <div className="flex justify-center gap-2.5 sm:gap-3 mt-10 sm:mt-12">
            {chefs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveChef(i)}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${
                  i === activeChef
                    ? "bg-[#d8232a] scale-125 shadow-md"
                    : "bg-gray-500/40 hover:bg-gray-500/60"
                }`}
                aria-label={`Chef ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


