import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";

export interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: {
    name: string;
    avatar: string;
  };
  date?: string;
  readTime?: string;
  tags?: string[];
  className?: string;
}

const defaultPost = {
  title: "The Future of UI Design",
  excerpt:
    "Exploring the latest trends in glassmorphism, 3D elements, and micro-interactions.",
  image:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  author: {
    name: "PulseRoot",
    avatar: "https://github.com/shadcn.png",
  },
  date: "Dec 2, 2025",
  readTime: "5 min read",
  tags: ["Design", "UI/UX"],
};

export function GlassBlogCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  image = defaultPost.image,
  author = defaultPost.author,
  date = defaultPost.date,
  readTime = defaultPost.readTime,
  tags = defaultPost.tags,
  className,
}: GlassBlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("h-full", className)}
    >
      <Card className="group relative h-full overflow-hidden rounded-2xl border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
        {/* Image Section */}
        {image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10" />
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
            />
            {/* Tags */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {tags?.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-black/50 backdrop-blur-sm hover:bg-black/80 border-white/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{readTime}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-zinc-400 line-clamp-3 mb-6">
            {excerpt}
          </p>

          {/* Author Section */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto">
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarImage src={author?.avatar} alt={author?.name} />
              <AvatarFallback className="bg-zinc-800">{author?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-zinc-200">
              {author?.name}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
