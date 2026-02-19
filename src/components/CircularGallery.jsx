import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slides from "../data/slides.json";

export default function CircularGallery() {
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const total = slides.length;
    const visibleCount = 7;
    const radius = 220;
    const centerIndex = Math.floor(visibleCount / 2);

    // infinite indexing
    const getItem = (offset) => {
        return slides[(active + offset + total) % total];
    };

    // semicircle positioning
    const getPosition = (i) => {
        const step = Math.PI / (visibleCount - 1);
        const angle = Math.PI - i * step;

        const x = radius * Math.cos(angle);
        const y = -radius * Math.sin(angle);

        return { x, y };
    };

    // card animation variants
    const cardVariants = {
        enter: (dir) => ({
            opacity: 0,
            scale: 0.8,
            y: 300,
            x: dir < 0 ? -220 : dir > 0 ? 220 : 0,
            rotate: dir < 0 ? -70 : dir > 0 ? 70 : 0
        }),

        center: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: 0
        },

        // exit opposite direction
        exit: (dir) => ({
            opacity: 0,
            scale: 0.85,
            y: 300,
            x: dir < 0 ? 220 : dir > 0 ? -220 : 0,
            rotate: dir < 0 ? 70 : dir > 0 ? -70 : 0
        })
    };

    return (
        <div
            className="relative w-full h-[700px] flex flex-col items-center justify-center overflow-hidden transition-all duration-500"
            style={{
                backgroundImage: `url(${slides[active].bgColor})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backfaceVisibility: "blur",
                blur: "20px"
            }}
        >
        {!isMobile && (
            <div className="absolute left-20 top-1/6 z-30 text-white max-w-md backdrop-blur-[2px]">
                <h1 className="text-6xl font-semibold leading-tight mb-6">
                    Summer <br /> bensa <br /> cool outfit
                </h1>

            </div>
            )}
             {!isMobile && (
            <div className="absolute left-20 bottom-30 z-30 text-white max-w-md backdrop-blur-lg px-6 py-4 rounded-xl shadow-lg">
                <p className="text-sm opacity-80">
                    <span className="text-2xl font-semibold leading-tight mb-6">We follow <br /> trends</span> <br />
                    <span>and bring modern fashion for everyone.</span>
                </p>
            </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-[45%]
                    bg-gradient-to-t
                    from-white/60
                    via-white/30
                    to-transparent
                    backdrop-blur-[2px]
                    pointer-events-none
                    z-20"
            />

            {/* CENTER BIG CARD */}
            <div className="relative w-full h-[560px] flex items-center justify-center overflow-hidden">

                {/* Glow behind card */}
                <div className="absolute w-[360px] h-[560px] rounded-[40px] opacity-40"
                />

                <div className="relative w-[340px] h-[540px] rounded-[30px] inset-shadow-sm inset-shadow-gray-500/50 overflow-hidden"
                >

                    {/* Image */}
                    <AnimatePresence mode="sync" custom={direction}>
                        <motion.img
                            key={slides[active].id}
                            src={slides[active].image}
                            variants={cardVariants}
                            custom={direction}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="absolute w-full h-full object-cover"
                            style={{ transformOrigin: "bottom center" }}
                        />
                    </AnimatePresence>



                </div>

            </div>
            {/* HALF CIRCLE THUMBNAILS */}

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[280px] z-30 ">
                {Array.from({ length: visibleCount }).map((_, i) => {
                    const offset = i - centerIndex;
                    const item = getItem(offset);
                    const pos = getPosition(i);

                    const isSelected = i === centerIndex;

                    return (
                        <motion.div
                            key={item.id}
                            onClick={() => {
                                const newIndex = (active + offset + total) % total;
                                setDirection(offset);
                                setActive(newIndex);
                            }}
                            animate={{
                                x: pos.x,
                                y: pos.y,
                                scale: isSelected ? 1.15 : 1 - Math.abs(i - centerIndex) * 0.15,
                                opacity: isSelected ? 1 : 0.75
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 14
                            }}
                            className={`
          absolute rounded-full cursor-pointer
          flex items-center justify-center
          bg-gray-200/20
          shadow-[0_6px_20px_rgba(0,0,0,0.25)]
          ${isSelected
                                    ? "border-3 border-gray-200/20"
                                    : "border-2 border-gray-200/20"}
        `}
                            style={{
                                width: isSelected ? "90px" : "70px",
                                height: isSelected ? "90px" : "70px",
                                left: "50%",
                                bottom: "0%",
                                translateX: "-50%"
                            }}
                        >
                            <img
                                src={item.image}
                                className="w-full h-full object-cover rounded-full"
                                alt=""
                            />
                        </motion.div>
                    );
                })}
            </div>
            {!isMobile && (
            <div className="absolute right-20 h-[700px]  flex items-center justify-center text-white text-9xl tracking-[30px] font-bold opacity-30 rotate-180"
                style={{ writingMode: "vertical-rl" }}>
                STYLE
            </div>
            )}
        </div>
    );
}
