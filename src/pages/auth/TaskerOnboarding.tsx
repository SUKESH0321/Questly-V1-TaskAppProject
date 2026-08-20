import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Upload, Briefcase, Camera, Pencil, Loader2, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { readImageAsDataUrl } from "@/lib/imageUtils";

const steps = [
  "Personal",
  "Skills",
  "Qualifications",
  "Portfolio",
  "Availability",
  "Verification"
];

const skillsList = [
  "Cleaning", "Tutoring", "Repair", "Photography", 
  "Delivery", "Pet Care", "Gardening", "Cooking", "Moving", "Plumbing"
];

interface OnboardingData {
  name: string;
  phone: string;
  location: string;
  skills: string[];
  education: string;
  certificates: string;
  about: string;
  portfolioLink: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  travelRadius: number;
  avatar: string;
  portfolioImages: string[];
}

export default function TaskerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();

  const [data, setData] = useState<OnboardingData>({
    name: "",
    phone: "",
    location: "",
    skills: [],
    education: "",
    certificates: "",
    about: "",
    portfolioLink: "",
    workingDays: [],
    startTime: "09:00",
    endTime: "17:00",
    travelRadius: 10,
    avatar: "",
    portfolioImages: [],
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleDay = (day: string) => {
    setData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleAvatarFile = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setIsUploadingAvatar(true);
    try {
      const dataUrl = await readImageAsDataUrl(file, 512);
      updateField("avatar", dataUrl);
    } catch {
      // Ignore files that can't be read.
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePortfolioFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const remaining = Math.max(0, 5 - data.portfolioImages.length);
    const toProcess = fileList.slice(0, remaining);
    if (toProcess.length === 0) return;

    setIsUploadingPortfolio(true);
    try {
      const dataUrls: string[] = [];
      for (const file of toProcess) {
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) continue;
        dataUrls.push(await readImageAsDataUrl(file));
      }
      updateField(
        "portfolioImages",
        [...data.portfolioImages, ...dataUrls].slice(0, 5),
      );
    } catch {
      // Ignore files that can't be read.
    } finally {
      setIsUploadingPortfolio(false);
    }
  };

  const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void handleAvatarFile(file);
  };

  const handlePortfolioSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    e.target.value = "";
    if (files && files.length > 0) void handlePortfolioFiles(files);
  };

  const handlePortfolioDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) void handlePortfolioFiles(e.dataTransfer.files);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      updateUser({
        name: data.name,
        phone: data.phone,
        location: data.location,
        ...(data.avatar ? { avatar: data.avatar } : {}),
        portfolioImages: data.portfolioImages,
      });
      navigate("/home");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Become a Tasker</h2>
        <p className="text-muted-foreground">Complete your profile to start earning.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-12 relative px-2">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted -z-10"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent -z-10 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
              index <= currentStep 
                ? 'bg-accent text-accent-foreground border-2 border-accent shadow-[0_0_0_4px_hsl(var(--background))]' 
                : 'bg-card text-muted-foreground border-2 border-border shadow-[0_0_0_4px_hsl(var(--background))]'
            }`}>
              {index < currentStep ? <Check size={16} /> : index + 1}
            </div>
            <span className={`text-xs font-medium hidden md:block absolute -bottom-6 ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border p-6 md:p-8 rounded-3xl shadow-sm mt-8">
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              <h3 className="text-xl font-bold">Personal Details</h3>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border group hover:border-accent cursor-pointer transition-colors"
                >
                  {data.avatar ? (
                    <img
                      src={data.avatar}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : isUploadingAvatar ? (
                    <Loader2 className="text-accent animate-spin" />
                  ) : (
                    <Camera className="text-muted-foreground group-hover:text-accent transition-colors" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground border-2 border-card cursor-pointer hover:bg-accent/90 transition-colors disabled:opacity-60"
                >
                  {data.avatar ? <Pencil size={14} /> : <Upload size={14} />}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input 
                  placeholder="John Doe" 
                  value={data.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone Number</label>
                <Input 
                  placeholder="+1 (555) 000-0000"
                  value={data.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input 
                  placeholder="City, State"
                  value={data.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              <h3 className="text-xl font-bold">What are your skills?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Select all that apply.</p>
            
            <div className="flex flex-wrap gap-3">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    data.skills.includes(skill)
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-transparent border-border text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              <h3 className="text-xl font-bold">Qualifications</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Highest Education</label>
                <Input 
                  placeholder="E.g. Bachelor's in Computer Science"
                  value={data.education}
                  onChange={(e) => updateField("education", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Certificates/Licenses</label>
                <Input 
                  placeholder="E.g. Certified Plumber"
                  value={data.certificates}
                  onChange={(e) => updateField("certificates", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">About Me</label>
                <textarea 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                  placeholder="Tell customers why they should hire you..."
                  value={data.about}
                  onChange={(e) => updateField("about", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              <h3 className="text-xl font-bold">Portfolio</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Showcase your previous work.</p>
            
            <input
              ref={portfolioInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePortfolioSelect}
            />

            <div
              onClick={() => portfolioInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handlePortfolioDrop}
              className="border-2 border-dashed border-accent/30 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-accent/5 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform mb-4">
                {isUploadingPortfolio ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Upload size={24} />
                )}
              </div>
              <h4 className="font-medium">
                {isUploadingPortfolio ? "Processing images..." : "Upload Images"}
              </h4>
              <p className="text-muted-foreground text-xs mt-1">
                Add up to 5 photos of your work ({data.portfolioImages.length}/5)
              </p>
            </div>

            {data.portfolioImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {data.portfolioImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                  >
                    <img
                      src={img}
                      alt={`Portfolio photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Remove portfolio photo ${i + 1}`}
                      onClick={() =>
                        updateField(
                          "portfolioImages",
                          data.portfolioImages.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm font-medium mb-1 block">Portfolio Link (Optional)</label>
              <Input 
                placeholder="https://..."
                value={data.portfolioLink}
                onChange={(e) => updateField("portfolioLink", e.target.value)}
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full"></div>
              <h3 className="text-xl font-bold">Availability</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Working Days</label>
                <div className="flex gap-2 flex-wrap">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <button 
                      key={day} 
                      onClick={() => toggleDay(day)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition-colors ${
                        data.workingDays.includes(day)
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border text-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Start Time</label>
                  <Input 
                    type="time" 
                    value={data.startTime}
                    onChange={(e) => updateField("startTime", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">End Time</label>
                  <Input 
                    type="time" 
                    value={data.endTime}
                    onChange={(e) => updateField("endTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="text-sm font-medium mb-1 block">Travel Radius (miles)</label>
                <input 
                  type="range" 
                  className="w-full accent-accent" 
                  min="1" 
                  max="50" 
                  value={data.travelRadius}
                  onChange={(e) => updateField("travelRadius", parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1m</span>
                  <span>{data.travelRadius}m</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in text-center py-6">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
              <Briefcase size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready for Verification</h3>
            <p className="text-muted-foreground mb-8">
              We need to verify your identity before you can start accepting tasks. This usually takes less than 24 hours.
            </p>
            
            <div className="bg-muted p-4 rounded-xl text-left space-y-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent font-semibold flex items-center justify-center shadow-sm border border-accent/30">1</div>
                <div>
                  <p className="font-medium text-sm">Government ID Upload</p>
                  <p className="text-xs text-muted-foreground">Passport, Driver's License, or National ID</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/15 text-accent font-semibold flex items-center justify-center shadow-sm border border-accent/30">2</div>
                <div>
                  <p className="font-medium text-sm">Selfie Verification</p>
                  <p className="text-xs text-muted-foreground">Take a quick selfie to match your ID</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" size="lg" onClick={handleBack} className={`${currentStep === 0 ? "invisible" : ""} hover:border-accent hover:text-accent`}>
          Back
        </Button>
        <Button size="lg" onClick={handleNext} className="min-w-[120px] bg-accent hover:bg-accent/90 text-accent-foreground">
          {currentStep === steps.length - 1 ? "Submit Verification" : "Continue"}
        </Button>
      </div>
    </div>
  );
}