import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Check,
  Upload,
  MapPin,
  Map,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/stores/taskStore";

const steps = ["Details", "Photos", "Location", "Budget", "Time", "Preview"];

interface TaskFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  time: string;
  date: string;
}

export default function CreateTask() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { addTask } = useTaskStore();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "Cleaning",
    location: "",
    budget: 85,
    time: "ASAP",
    date: "Today",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = <K extends keyof TaskFormData>(
    key: K,
    value: TaskFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((curr) => curr + 1);
      return;
    }

    setSubmitError(null);

    try {
      const newTask = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        budget: formData.budget,
        location: formData.location || "123 Main St, New York",
        time: formData.time,
        date: formData.date || new Date().toISOString().split("T")[0],
      };
      const createdTask = await addTask(newTask);
      navigate(`/tasks/success?id=${createdTask.id}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "We couldn’t create this task right now.";
      setSubmitError(message);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((curr) => curr - 1);
    } else {
      navigate(-1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.title.length >= 3 && formData.description.length >= 10;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 pt-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="mr-4"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Post a new task</h1>
          <p className="text-muted-foreground text-sm">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border -z-10"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
                index <= currentStep
                  ? "bg-primary text-primary-foreground border-2 border-primary shadow-[0_0_0_4px_hsl(var(--background))]"
                  : "bg-card text-muted-foreground border-2 border-border shadow-[0_0_0_4px_hsl(var(--background))]"
              }`}
            >
              {index < currentStep ? <Check size={16} /> : index + 1}
            </div>
            <span
              className={`text-xs font-medium hidden md:block ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm">
        {submitError && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </div>
        )}

        {currentStep === 0 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-xl font-bold">What do you need help with?</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Task Title
                </label>
                <Input
                  placeholder="E.g. Clean my 2BHK apartment"
                  className="text-lg py-6"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Description
                </label>
                <textarea
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[120px]"
                  placeholder="Provide details about what needs to be done..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Category
                </label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option>Cleaning</option>
                  <option>Repairs</option>
                  <option>Moving</option>
                  <option>Delivery</option>
                  <option>Tutoring</option>
                  <option>Plumbing</option>
                  <option>Furniture Assembly</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-xl font-bold">Add some photos</h2>
            <p className="text-muted-foreground">
              Photos help taskers understand what needs to be done.
            </p>

            <div className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                <Upload size={28} />
              </div>
              <h3 className="font-medium text-lg">
                Click to upload or drag and drop
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-xl font-bold">Where should this be done?</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-8 flex-col gap-2"
                >
                  <MapPin className="text-primary" />
                  <span>My Current Location</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-8 flex-col gap-2"
                >
                  <Map className="text-primary" />
                  <span>Select on Map</span>
                </Button>
              </div>

              <div className="pt-4">
                <label className="text-sm font-medium mb-1 block">
                  Or enter address manually
                </label>
                <Input
                  placeholder="Enter street address"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-xl font-bold">Set your budget</h2>

            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border rounded-xl p-6 cursor-pointer transition-colors text-center relative overflow-hidden ${
                  formData.budget === 85
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => updateField("budget", 85)}
              >
                <Badge className="absolute top-2 right-2 bg-accent/20 text-accent hover:bg-accent/20">
                  Suggested
                </Badge>
                <div className="text-3xl font-bold text-primary mb-2">₹85</div>
                <div className="text-sm font-medium text-foreground">
                  Estimated Fair Price
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Based on similar tasks
                </div>
              </div>

              <div className="border border-border rounded-xl p-6 text-center flex flex-col justify-center items-center">
                <DollarSign size={24} className="text-muted-foreground mb-2" />
                <div className="font-medium text-foreground mb-2">
                  Set custom budget
                </div>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="text-center"
                  value={formData.budget === 85 ? "" : formData.budget}
                  onChange={(e) =>
                    updateField("budget", parseInt(e.target.value) || 0)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-xl font-bold">When do you need it done?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Asap / Now", icon: Clock, value: "ASAP" },
                { label: "Today", icon: Calendar, value: "Today" },
                { label: "Schedule Later", icon: Calendar, value: "Scheduled" },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={`py-8 flex-col gap-2 ${
                    formData.time === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => updateField("time", option.value)}
                >
                  <option.icon />
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-xl font-bold">Review your task</h2>

            <div className="bg-muted p-6 rounded-xl space-y-4">
              <div>
                <h3 className="font-bold text-lg">
                  {formData.title || "Untitled Task"}
                </h3>
                <p className="text-muted-foreground">
                  {formData.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Category
                  </div>
                  <div className="font-medium">{formData.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Budget
                  </div>
                  <div className="font-medium text-primary">
                    ₹{formData.budget}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Location
                  </div>
                  <div className="font-medium">
                    {formData.location || "123 Main St, New York"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Time</div>
                  <div className="font-medium">{formData.time}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          className={currentStep === 0 ? "invisible" : ""}
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          className="min-w-[120px]"
          disabled={!canProceed()}
        >
          {currentStep === steps.length - 1 ? "Post Task" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
