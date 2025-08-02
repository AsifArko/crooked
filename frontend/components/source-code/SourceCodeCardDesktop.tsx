"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ShoppingCart, Star, Eye } from "lucide-react";

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

interface SourceCodeCardDesktopProps {
  sourceCode: SourceCode;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function SourceCodeCardDesktop({
  sourceCode,
}: SourceCodeCardDesktopProps) {
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Image with overlay */}
        <div className="relative h-56 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 overflow-hidden">
          {sourceCode.mainImage ? (
            <Image
              src={sourceCode.mainImage.asset.url}
              alt={sourceCode.title}
              width={600}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Github className="w-20 h-20 text-gray-400" />
            </div>
          )}

          {/* Price badge */}
          <div className="absolute top-4 right-4">
            <Badge
              variant="secondary"
              className="bg-white/95 dark:bg-slate-800/95 text-lg font-semibold px-3 py-1"
            >
              ${sourceCode.price}
            </Badge>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 dark:bg-slate-800/90"
                onClick={() => window.open(sourceCode.githubUrl, "_blank")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </motion.div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {sourceCode.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {sourceCode.description}
              </p>
            </div>

            {/* Technologies */}
            {sourceCode.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sourceCode.technologies.slice(0, 4).map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {sourceCode.technologies.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{sourceCode.technologies.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            {sourceCode.features.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key Features
                </h4>
                <div className="space-y-1">
                  {sourceCode.features.slice(0, 3).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Star className="w-4 h-4 mr-2 text-yellow-500 flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="w-full space-y-3">
            <Button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-base font-medium"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Buy Now - ${sourceCode.price}
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 h-10"
                onClick={() => window.open(sourceCode.githubUrl, "_blank")}
              >
                <Github className="w-4 h-4 mr-2" />
                View Code
              </Button>

              {sourceCode.demoUrl && (
                <Button
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={() => window.open(sourceCode.demoUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
