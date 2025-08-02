"use client";

import { motion } from "framer-motion";
import { DocumentCard } from "./DocumentCard";

interface Document {
  _id: string;
  name: string;
  category: string;
  description?: string;
  file: {
    asset: {
      url: string;
    };
  };
  isPublic: boolean;
  uploadedAt: string;
}

interface DocumentGridProps {
  documents: Document[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function DocumentGrid({ documents }: DocumentGridProps) {
  const publicDocuments = documents.filter((doc) => doc.isPublic);

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Resources
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
            Documents & Resources
          </h2>
          <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xl">
            Download my resume, research papers, and other important documents.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {publicDocuments.map((document) => (
            <DocumentCard key={document._id} document={document} />
          ))}
        </motion.div>

        {publicDocuments.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              No documents available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
