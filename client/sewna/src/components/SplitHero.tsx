import { ArrowRight } from "lucide-react";
import { Button } from"./ui/button";
import designerHero from "../assets/img2.png";
import clientHero from "../assets/img1.png"
import { useNavigate } from "react-router-dom";

interface SideProps {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
  position: "left" | "right";
  isDark?: boolean;
  handleClick?: () => void
}

const Side = ({ title, description, buttonText, backgroundImage, position, isDark, handleClick }: SideProps) => {
  const animationClass = position === "left" ? "animate-slide-in-left" : "animate-slide-in-right";

  return (
    <div
      className={`relative h-screen w-full overflow-hidden group ${animationClass}`}
      style={{
        animationDelay: position === "left" ? "0ms" : "200ms",
        animationFillMode: "both",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-black/60 group-hover:bg-black/50"
              : "bg-white/70 group-hover:bg-white/60"
          } transition-colors duration-500`}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="max-w-xl space-y-6 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <h1
            className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-foreground"
            }`}
          >
            {title}
          </h1>

          <p
            className={`text-lg md:text-xl ${
              isDark ? "text-white/90" : "text-muted-foreground"
            } max-w-md mx-auto`}
          >
            {description}
          </p>

          <div className="pt-4">
            <Button
              size="lg"
              className={`group/btn text-lg px-8 py-6 rounded-full transition-all duration-300 ${
                isDark
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-[0_0_30px_rgba(0,182,127,0.4)]"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]"
              }`}
              onClick={handleClick}
            >
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${
          isDark ? "bg-accent" : "bg-primary"
        } transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}
      />
    </div>
  );
};

export const SplitHero = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Side
        title="I am a designer"
        description="Showcase your talent, connect with clients, and bring your creative vision to life."
        buttonText="Join as Designer"
        backgroundImage={designerHero}
        position="left"
        isDark={true}
      />
      <Side
        title="I need a designer"
        description="Discover exceptional talent and collaborate with designers who understand your vision."
        buttonText="Find Designers"
        backgroundImage={clientHero}
        position="right"
        isDark={false}
        handleClick={() => navigate('/find-designers')}
      />
    </div>
  );
};
