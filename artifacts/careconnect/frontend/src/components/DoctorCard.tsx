import React from "react";
import { Link } from "wouter";
import { Star, MapPin, Clock, Award, ShieldCheck, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import BookAppointmentDialog from "./BookAppointmentDialog";

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
}

export function getSpecialtyGradient(specialty: string) {
  switch (specialty.toLowerCase()) {
    case 'cardiology':
      return 'bg-gradient-to-br from-rose-500 to-red-600';
    case 'neurology':
      return 'bg-gradient-to-br from-violet-500 to-purple-600';
    case 'orthopedics':
      return 'bg-gradient-to-br from-amber-500 to-orange-600';
    case 'dermatology':
      return 'bg-gradient-to-br from-pink-400 to-rose-500';
    case 'pediatrics':
      return 'bg-gradient-to-br from-sky-400 to-cyan-500';
    case 'pulmonology':
      return 'bg-gradient-to-br from-teal-400 to-emerald-500';
    default:
      return 'bg-gradient-to-br from-blue-500 to-indigo-600';
  }
}

export default function DoctorCard({ doctor, index = 0 }: DoctorCardProps) {
  const gradient = getSpecialtyGradient(doctor.specialty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 group h-full flex flex-col">
        {/* Header Image Area */}
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          {/* Background Gradient */}
          <div className={`absolute inset-0 opacity-20 ${gradient}`} />
          
          {/* Doctor Image */}
          {doctor.imageUrl ? (
            <img 
              src={doctor.imageUrl} 
              alt={doctor.name} 
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`h-full w-full flex items-center justify-center ${gradient} text-white text-4xl font-bold`}>
              {doctor.name.charAt(0)}
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className={doctor.available ? "bg-emerald-500/90 text-white border-none" : "bg-muted/90 text-muted-foreground border-none"}>
              {doctor.available ? "Available Today" : "Fully Booked"}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-black border-none flex items-center gap-1 font-semibold backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {doctor.rating}
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="font-bold text-xl leading-tight">{doctor.name}</h3>
            <p className="text-white/80 text-sm font-medium">{doctor.specialty}</p>
          </div>
        </div>

        {/* Body */}
        <CardContent className="flex-1 p-5 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className={`text-xs px-2 py-0.5 border-none text-white ${gradient}`}>
              {doctor.specialty}
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-none flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {doctor.bio || `Specialist in ${doctor.specialty} with extensive experience in providing premium healthcare.`}
          </p>

          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4 text-primary/70" />
              <span>{doctor.experience} yrs exp.</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground">${doctor.fee}</span> / visit
            </div>
            {doctor.location && (
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span className="truncate">{doctor.location}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="p-5 pt-0 flex gap-3">
          <BookAppointmentDialog doctor={doctor}>
            <Button className="flex-1 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-transform active:scale-95" disabled={!doctor.available}>
              <CalendarCheck className="mr-2 h-4 w-4" />
              Book
            </Button>
          </BookAppointmentDialog>
          
          <Link href={`/doctor/${doctor.id}`}>
            <Button variant="outline" className="flex-none px-4 transition-transform active:scale-95">
              Profile
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
