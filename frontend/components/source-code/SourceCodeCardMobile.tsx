"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ShoppingCart, Star } from "lucide-react";

interface SourceCode {
  _id: string;
  title: string;
  slug: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  price: number;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  technologies: string[];
  features: string[];
  isPublished: boolean;
}

interface SourceCodeCardMobileProps {
  sourceCode: SourceCode;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SourceCodeCardMobile({
  sourceCode,
}: SourceCodeCardMobileProps) {
  const handleBuyNow = async () => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCodeId: sourceCode._id,
          title: sourceCode.title,
          price: sourceCode.price,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg overflow-hidden">
          {sourceCode.mainImage ? (
            <Image
              src={sourceCode.mainImage.asset.url}
              alt={sourceCode.title}
              width={400}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Github className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-white/90 dark:bg-slate-800/90"
            >
              ${sourceCode.price}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                {sourceCode.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {sourceCode.description}
              </p>
            </div>

            {/* Technologies */}
            {sourceCode.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {sourceCode.technologies.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {sourceCode.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{sourceCode.technologies.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Features */}
            {sourceCode.features.length > 0 && (
              <div className="space-y-1">
                {sourceCode.features.slice(0, 2).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs text-gray-500 dark:text-gray-400"
                  >
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    <span className="line-clamp-1">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-2">
            <Button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now - ${sourceCode.price}
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(sourceCode.githubUrl, "_blank")}
              >
                <Github className="w-4 h-4 mr-1" />
                View Code
              </Button>

              {sourceCode.demoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(sourceCode.demoUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Demo
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
