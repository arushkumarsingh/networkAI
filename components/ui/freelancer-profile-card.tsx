import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Bookmark } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FreelancerProfileCardProps extends HTMLMotionProps<"div"> {
  name: string;
  title: string;
  bannerSrc: string;
  context: string;
  onGetInTouch?: () => void;
  onBookmark?: () => void;
  className?: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    scale: 1.03,
    transition: { duration: 0.3 }
  }
};

const contentVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const FreelancerProfileCard = React.forwardRef<
  HTMLDivElement,
  FreelancerProfileCardProps
>(
  (
    {
      className,
      name,
      title,
      bannerSrc,
      context,
      onGetInTouch,
      onBookmark,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        {...props}
      >
        <div className="h-40 w-full">
          <img
            src={bannerSrc}
            alt={`${name}'s banner`}
            className="h-full w-full object-cover"
          />
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 h-9 w-9 rounded-lg bg-background/50 backdrop-blur-sm text-card-foreground/80 hover:bg-background/70"
          onClick={onBookmark}
          aria-label="Bookmark profile"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        <motion.div className="px-6 pb-6 pt-6" variants={contentVariants}>
          <motion.div className="mb-4" variants={itemVariants}>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </motion.div>

          <motion.div
            className="my-4 rounded-lg border border-border bg-background/30 p-4 text-sm text-muted-foreground"
            variants={itemVariants}
          >
            {context}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button className="w-full" size="lg" onClick={onGetInTouch}>
              Get in touch
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
);
FreelancerProfileCard.displayName = "FreelancerProfileCard";
