'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Github, Linkedin, Mail } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function HeroMobile() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        className="w-full max-w-md"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <span className="text-2xl font-bold text-white">A</span>
          </motion.div>
          
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            variants={fadeInUp}
          >
            Asif Arko
          </motion.h1>
          
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-6"
            variants={fadeInUp}
          >
            Full Stack Developer & Open Source Enthusiast
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-4"
          variants={fadeInUp}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                I build modern web applications with cutting-edge technologies. 
                Passionate about clean code, user experience, and open source.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Resume</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </Button>
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 p-0"
            >
              <Github className="w-5 h-5" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 p-0"
            >
              <Linkedin className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
} 