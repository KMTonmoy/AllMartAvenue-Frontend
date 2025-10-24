import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Github, Phone, Mail, ExternalLink, MapPin, Star, MessageCircle, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const OurDevelopers = () => {
  const developerInfo = {
    name: "Tonmoy Ahamed",
    title: "ফুল স্ট্যাক ওয়েব ডেভেলপার",
    description: "আমি একজন উৎসাহী ফুল স্ট্যাক ডেভেলপার, আধুনিক ওয়েব টেকনোলজিতে দক্ষ। আমি রেসপন্সিভ, হাই-পারফরম্যান্স ওয়েবসাইট এবং ওয়েব অ্যাপ্লিকেশন তৈরি করি। ব্যবসার ওয়েবসাইট, ই-কমার্স প্ল্যাটফর্ম বা কাস্টম ওয়েব অ্যাপ্লিকেশন প্রয়োজন হলে আমি আপনার ধারণাকে বাস্তবে রূপ দিতে পারি। সুন্দর ডিজাইন এবং শক্তিশালী ব্যাকএন্ড দক্ষতার মাধ্যমে আমি seamless ডিজিটাল অভিজ্ঞতা তৈরি করি।",
    photo: "https://res.cloudinary.com/dgwknm4yi/image/upload/v1758275707/wmremove-transformed-Picsart-AiImageEnhance_epxzfm.jpg",
    phone: "+8801622564462",
    whatsapp: "+8801342141562",
    email: "tonmoyahamed2009@gmail.com",
    email2: "tonmoyahamed159@gmail.com",
    portfolio: "https://tonmoy-pro.vercel.app/",
    github: "https://github.com/KMTonmoy",
    facebook: "https://www.facebook.com/tonmoy.ahamed.479135",
    upwork: "https://www.upwork.com/freelancers/~01a0139cd5f56c0ade?mp_source=share",
    location: "ইশ্বরদী, পাবনা, বাংলাদেশ",
    skills: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS", "MongoDB", "Express.js", "Python", "Firebase"]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent mb-4">
            আমাদের ডেভেলপার
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AllMart Avenue-এর পিছনের দক্ষ মনকে জানুন
          </p>
        </div>

        {/* Main Profile Section */}
        <Card className="bg-background/95 backdrop-blur border-0 shadow-2xl overflow-hidden max-w-6xl mx-auto">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Image */}
              <div className="lg:w-2/5 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 lg:p-12">
                <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                  <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-70"></div>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <Image
                      src={developerInfo.photo}
                      alt={developerInfo.name}
                      width={600}
                      height={600}
                      className="object-cover w-full h-auto"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 text-sm font-semibold shadow-lg border-0">
                      <Star className="h-4 w-4 mr-1" />
                      কাজের জন্য উপলব্ধ
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="lg:w-3/5 p-8 lg:p-12">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{developerInfo.name}</h2>
                    <p className="text-xl text-muted-foreground mt-2">{developerInfo.title}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{developerInfo.location}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-foreground leading-relaxed text-base">
                      {developerInfo.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-lg">দক্ষতা ও প্রযুক্তি</h3>
                    <div className="flex flex-wrap gap-2">
                      {developerInfo.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100 border-blue-200 px-3 py-1 text-sm font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">৫০+</div>
                      <div className="text-xs text-muted-foreground">প্রকল্প</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">২+</div>
                      <div className="text-xs text-muted-foreground">বছরের অভিজ্ঞতা</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">১০০%</div>
                      <div className="text-xs text-muted-foreground">সন্তুষ্টি</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">২৪/৭</div>
                      <div className="text-xs text-muted-foreground">সাপোর্ট</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground text-lg">যোগাযোগ করুন</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                        <Link href={`tel:${developerInfo.phone}`}>
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{developerInfo.phone}</span>
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                        <Link href={`https://wa.me/${developerInfo.whatsapp.replace('+', '')}`} target="_blank">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">হোয়াটসঅ্যাপ</span>
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                        <Link href={`mailto:${developerInfo.email}`}>
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">ইমেইল করুন</span>
                        </Link>
                      </Button>

                      <Button className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-[#1488CC] to-[#2B32B2] hover:opacity-90" asChild>
                        <Link href={developerInfo.portfolio} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm">পোর্টফোলিও দেখুন</span>
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                        <Link href={developerInfo.upwork} target="_blank">
                          <Briefcase className="h-4 w-4" />
                          <span className="text-sm">Upwork প্রোফাইল</span>
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full justify-start gap-3 h-12" asChild>
                        <Link href={developerInfo.github} target="_blank">
                          <Github className="h-4 w-4" />
                          <span className="text-sm">GitHub</span>
                        </Link>
                      </Button>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
                        <Link href={developerInfo.github} target="_blank">
                          <Github className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
                        <Link href={developerInfo.facebook} target="_blank">
                          <Facebook className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
                        <Link href={developerInfo.upwork} target="_blank">
                          <Briefcase className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
                        <Link href={`mailto:${developerInfo.email}`}>
                          <Mail className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-[#1488CC] to-[#2B32B2] border-0 shadow-2xl text-white">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">আপনার প্রকল্প শুরু করতে প্রস্তুত?</h3>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                একটি প্রফেশনাল ওয়েবসাইট বা ওয়েব অ্যাপ্লিকেশন তৈরি করতে চলুন একসাথে কাজ করি।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-[#1488CC] hover:bg-white/90 font-semibold px-6 py-3" asChild>
                  <Link href={`https://wa.me/${developerInfo.whatsapp.replace('+', '')}`} target="_blank">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    হোয়াটসঅ্যাপে শুরু করুন
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-[#1488CC] hover:bg-white/90 font-semibold px-6 py-3" asChild>
                  <Link href={developerInfo.upwork} target="_blank">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Upwork-এ হায়ার করুন
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-white text-[#1488CC] hover:bg-white/90 font-semibold px-6 py-3" asChild>
                  <Link href={`mailto:${developerInfo.email}`}>
                    <Mail className="h-5 w-5 mr-2" />
                    ইমেইল পাঠান
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OurDevelopers;
