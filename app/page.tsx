"use client";

import React, { useState } from "react";
import {
  Activity, 
  CreditCard, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Server, 
  Wifi, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";

interface FormData {
  gender: string;
  SeniorCitizen: boolean;
  Partner: boolean;
  Dependents: boolean;
  tenure: number;
  PhoneService: boolean;
  MultipleLines: boolean; 
  InternetService: string;
  OnlineSecurity: boolean;
  OnlineBackup: boolean;
  DeviceProtection: boolean;
  TechSupport: boolean;
  StreamingTV: boolean;
  StreamingMovies: boolean;
  Contract: string;
  PaperlessBilling: boolean;
  PaymentMethod: string;
  MonthlyCharges: number;
  TotalCharges: number;
}

export default function Home() {
  // 1. STATE
  const [formData, setFormData] = useState<FormData>({
    gender: "Male",
    SeniorCitizen: false,
    Partner: false,
    Dependents: false,
    tenure: 12,
    PhoneService: true,
    MultipleLines: false, // Default No
    InternetService: "Fiber optic",
    OnlineSecurity: false,
    OnlineBackup: false,
    DeviceProtection: false,
    TechSupport: false,
    StreamingTV: false,
    StreamingMovies: false,
    Contract: "Month-to-month",
    PaperlessBilling: true,
    PaymentMethod: "Electronic check",
    MonthlyCharges: 70.0,
    TotalCharges: 840.0,
  });

  const [colabUrl, setColabUrl] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    prediction: string;
    probability: number;
    shap_factors: { feature: string; impact: number }[];
  } | null>(null);

  // 2. HANDLERS
  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    if (!colabUrl) return alert("Please enter the Colab URL!");
    setLoading(true);

    try {
      // Convert UI types (Booleans) to Python types (Yes/No strings or 0/1 ints)
      const payload = {
        ...formData,
        SeniorCitizen: formData.SeniorCitizen ? 1 : 0,
        Partner: formData.Partner ? "Yes" : "No",
        Dependents: formData.Dependents ? "Yes" : "No",
        PhoneService: formData.PhoneService ? "Yes" : "No",
        MultipleLines: formData.MultipleLines ? "Yes" : "No",
        OnlineSecurity: formData.OnlineSecurity ? "Yes" : "No",
        OnlineBackup: formData.OnlineBackup ? "Yes" : "No",
        DeviceProtection: formData.DeviceProtection ? "Yes" : "No",
        TechSupport: formData.TechSupport ? "Yes" : "No",
        StreamingTV: formData.StreamingTV ? "Yes" : "No",
        StreamingMovies: formData.StreamingMovies ? "Yes" : "No",
        PaperlessBilling: formData.PaperlessBilling ? "Yes" : "No",
      };

      const res = await fetch(`${colabUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect. Check URL or Colab console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Customer Churn Prediction</h1>
          <p className="text-slate-500 mt-1">Predict and analyze customer churn risk using machine learning insights</p>
          
          {/* URL Input */}
          <div className="mt-4 flex items-center gap-2 max-w-md">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border shadow-sm w-full">
              <Server className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Paste Ngrok URL here..."
                className="outline-none text-sm w-full text-slate-600"
                value={colabUrl}
                onChange={(e) => setColabUrl(e.target.value)}
              />
              {colabUrl && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-semibold text-lg text-slate-800">Customer Profile Inputs</h2>
                <p className="text-sm text-slate-400">Enter customer information to predict churn risk</p>
              </div>

              <div className="divide-y divide-slate-100">
                
                {/* 1. Demographics */}
                <Section title="1. Demographics" icon={<User className="w-4 h-4" />}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Gender</label>
                      <select 
                        className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm text-slate-700 font-medium focus:ring-2 focus:ring-black/5"
                        value={formData.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <Toggle label="Senior Citizen (65+)" checked={formData.SeniorCitizen} onChange={(v) => handleChange("SeniorCitizen", v)} />
                    <Toggle label="Has Partner" checked={formData.Partner} onChange={(v) => handleChange("Partner", v)} />
                    <Toggle label="Has Dependents" checked={formData.Dependents} onChange={(v) => handleChange("Dependents", v)} />
                  </div>
                </Section>

                {/* 2. Services */}
                <Section title="2. Subscribed Services" icon={<Wifi className="w-4 h-4" />}>
                  <div className="space-y-4">
                    <Toggle label="Phone Service" checked={formData.PhoneService} onChange={(v) => handleChange("PhoneService", v)} />
                    {/* Added Missing Input */}
                    <Toggle label="Multiple Lines" checked={formData.MultipleLines} onChange={(v) => handleChange("MultipleLines", v)} />
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Internet Service</label>
                      <select 
                        className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm text-slate-700 font-medium"
                        value={formData.InternetService}
                        onChange={(e) => handleChange("InternetService", e.target.value)}
                      >
                        <option>Fiber optic</option>
                        <option>DSL</option>
                        <option>No</option>
                      </select>
                    </div>

                    <Toggle label="Online Security" checked={formData.OnlineSecurity} onChange={(v) => handleChange("OnlineSecurity", v)} />
                    {/* Added Missing Input */}
                    <Toggle label="Online Backup" checked={formData.OnlineBackup} onChange={(v) => handleChange("OnlineBackup", v)} />
                    {/* Added Missing Input */}
                    <Toggle label="Device Protection" checked={formData.DeviceProtection} onChange={(v) => handleChange("DeviceProtection", v)} />
                    <Toggle label="Tech Support" checked={formData.TechSupport} onChange={(v) => handleChange("TechSupport", v)} />
                    <Toggle label="Streaming TV" checked={formData.StreamingTV} onChange={(v) => handleChange("StreamingTV", v)} />
                    <Toggle label="Streaming Movies" checked={formData.StreamingMovies} onChange={(v) => handleChange("StreamingMovies", v)} />
                  </div>
                </Section>

                {/* 3. Account Details */}
                <Section title="3. Account Details & Usage" icon={<CreditCard className="w-4 h-4" />}>
                  <div className="space-y-6">
                    
                    {/* Tenure Slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-slate-800">Tenure (Months)</label>
                        <span className="text-xs font-bold text-slate-500">{formData.tenure}</span>
                      </div>
                      <input 
                        type="range" min="0" max="72"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        value={formData.tenure}
                        onChange={(e) => handleChange("tenure", Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Contract Type</label>
                      <select 
                        className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm text-slate-700 font-medium"
                        value={formData.Contract}
                        onChange={(e) => handleChange("Contract", e.target.value)}
                      >
                        <option>Month-to-month</option>
                        <option>One year</option>
                        <option>Two year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">Payment Method</label>
                      <select 
                        className="w-full p-2.5 bg-gray-50 border-none rounded-lg text-sm text-slate-700 font-medium"
                        value={formData.PaymentMethod}
                        onChange={(e) => handleChange("PaymentMethod", e.target.value)}
                      >
                        <option>Electronic check</option>
                        <option>Mailed check</option>
                        <option>Bank transfer</option>
                        <option>Credit card</option>
                      </select>
                    </div>

                    <Toggle label="Paperless Billing" checked={formData.PaperlessBilling} onChange={(v) => handleChange("PaperlessBilling", v)} />

                    {/* Charges Slider */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-slate-800">Monthly Charges ($)</label>
                        <span className="text-xs font-bold text-slate-500">${formData.MonthlyCharges}</span>
                      </div>
                      <input 
                        type="range" min="0" max="150"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                        value={formData.MonthlyCharges}
                        onChange={(e) => handleChange("MonthlyCharges", Number(e.target.value))}
                      />
                    </div>
                    
                    <div>
                       <label className="text-xs font-bold text-slate-800">Total Charges (Calculated)</label>
                       <div className="w-full p-3 mt-1 bg-gray-50 rounded-lg text-sm text-slate-500 font-medium">
                          ${(formData.MonthlyCharges * formData.tenure).toFixed(2)}
                       </div>
                    </div>

                  </div>
                </Section>
              </div>

              <div className="p-6 bg-white">
                <button 
                  onClick={handlePredict}
                  disabled={loading}
                  className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex justify-center items-center gap-2"
                >
                  {loading ? "Analyzing..." : "Predict Churn Risk"}
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-full min-h-[500px]">
              
              <div className="mb-8">
                <h2 className="font-semibold text-lg text-slate-800">Prediction Analysis</h2>
                <p className="text-sm text-slate-400">Machine learning model results</p>
              </div>

              {result ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* PREDICTION CARD */}
                  <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className={`p-4 rounded-full mb-4 ${result.prediction === "Churn" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                       {result.prediction === "Churn" ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
                    </div>
                    
                    <div className={`px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide mb-6 ${
                      result.prediction === "Churn" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                    }`}>
                      {result.prediction === "Churn" ? "High Churn Risk" : "Customer Retained"}
                    </div>

                    <div className="text-center w-full max-w-xs">
                      <p className="text-slate-500 text-sm font-medium mb-1">Churn Probability</p>
                      <p className={`text-3xl font-bold mb-4 ${result.prediction === "Churn" ? "text-red-600" : "text-green-600"}`}>
                        {Math.round(result.probability * 100)}%
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${result.prediction === "Churn" ? "bg-red-600" : "bg-green-500"}`}
                          style={{ width: `${result.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SHAP CHART */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Top Contributing Factors</h3>
                    <p className="text-sm text-slate-400 mb-6">SHAP Explainability Analysis</p>
                    
                    <div className="space-y-4">
                      {result.shap_factors.map((factor, i) => {
                        const barWidth = Math.min(Math.abs(factor.impact) * 500, 100); 
                        return (
                          <div key={i} className="group">
                            <div className="flex items-center gap-4">
                              <div className="w-40 text-right text-xs font-medium text-slate-500 truncate">
                                {factor.feature}
                              </div>
                              <div className="flex-1">
                                <div 
                                  className="h-8 bg-blue-500 rounded-md transition-all group-hover:bg-blue-600"
                                  style={{ width: `${barWidth}%`, minWidth: '4px' }}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 mt-12">
                   <div className="mb-4">
                     <Activity size={64} className="text-slate-200" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-800">No prediction yet</h3>
                   <p className="text-sm text-slate-500 max-w-xs mt-2">
                     Enter customer details and click &quot;Predict Churn Risk&quot; to see the analysis
                   </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

// --- HELPER COMPONENTS FOR STYLING ---

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="p-6">
       <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between mb-4 group">
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
            {icon}
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
       </button>
       {isOpen && <div className="animate-in fade-in slide-in-from-top-2">{children}</div>}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-black' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}