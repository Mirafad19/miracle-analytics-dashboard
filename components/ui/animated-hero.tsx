
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Instantly", "Effortlessly", "Securely", "Smartly", "Seamlessly"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-4 py-8 lg:py-16 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-center text-white">
              <span className="block mb-2">From Raw Data to Actionable Insights.</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center h-[1.3em]">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-extrabold text-yellow-300 [text-shadow:0_0_15px_rgba(234,179,8,0.7)]"
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -50 : 50,
                            opacity: 0,
                          }
                    }
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    {title}.
                  </motion.span>
                ))}
              </span>
            </h2>
            
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-indigo-100 text-center">
              Watch how our AI-driven dashboard instantly transforms complex financial spreadsheets into clear, strategic intelligence for your organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
