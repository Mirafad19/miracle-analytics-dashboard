
import React from "react"
import { cn } from "../../lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-900",
        "p-4 text-start sm:p-6",
        "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        "shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-zinc-900 dark:text-zinc-100">
            {author.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-zinc-600 dark:text-zinc-300">
        {text}
      </p>
    </Card>
  )
}
