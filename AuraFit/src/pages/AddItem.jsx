import { useParams } from "react-router-dom";
import axios from "axios";
import { useMemo, useRef, useState,useEffect } from "react";
import logo from "../assests/logo.png";
import { analyzeClothingImage } from "../services/aiService";

const defaultCategories = [
  "Tops",
  "T-Shirts",
  "Jeans",
  "Trousers",
  "Kurtis",
  "Shoes",
  "Accessories",
  "Jackets",
];

const occasionOptions = ["Casual", "Formal", "Party", "College", "Travel"];
const seasonOptions = ["Summer", "Winter", "Monsoon", "All Season"];

const inputClassName =
  "w-full rounded-2xl border border-white/50 bg-white/45 px-4 py-3.5 text-sm font-medium text-[#4C1D95] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none backdrop-blur-md transition duration-300 placeholder:text-[#7C3AED]/60 focus:border-[#C084FC] focus:bg-white/60 focus:ring-4 focus:ring-[#C084FC]/25";

function AddItem({ onCancel }) {
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Tops",
    color: "",
    occasion: "Casual",
    season: "All Season",
    notes: "",
  });
  useEffect(() => {
  if (isEditMode) {
    fetchItem();
  }
  }, [id]);

  const fetchItem = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/clothes",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const item = response.data.find(
      (cloth) => cloth._id === id
    );

    if (item) {
      setFormData({
        itemName: item.name,
        category: item.category,
        color: item.color,
        occasion: item.occasion,
        season: item.season,
        notes: item.notes,
      });

      setImagePreview(item.image);
      if (item.aiMetadata) {
  setAiMetadata(item.aiMetadata);
}
    }
  } catch (error) {
    console.error(error);
  }
};

  const helperText = useMemo(
    () =>
      imagePreview
        ? "Preview ready. You can replace the image anytime."
        : "Upload a clean product-style photo for the best future AI wardrobe experience.",
    [imagePreview]
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const [aiMetadata, setAiMetadata] = useState({
  description: "",
  category: "",
  subCategory: "",
  colors: [],
  occasion: "",
  season: "",
  material: "",
  pattern: "",
  sleeveLength: "",
  fit: "",
  brand: "",
  confidence: null,
});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFile = async (file) => {
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisError("");

    try {
      setIsAnalyzing(true);

      const aiData = await analyzeClothingImage(file);
      console.log("AI Response:", aiData);

      // Save complete AI metadata
      setAiMetadata({
        description: aiData.description || "",
        category: aiData.category || "",
        subCategory: aiData.subCategory || "",
        colors: aiData.colors || [],
        occasion: aiData.occasion || "",
        season: aiData.season || "",
        material: aiData.material || "",
        pattern: aiData.pattern || "",
        sleeveLength: aiData.sleeveLength || "",
        fit: aiData.fit || "",
        brand: aiData.brand || "",
        confidence: aiData.confidence || null,
      });

      // Resolve AI category against existing categories (case-insensitive,
      // trimmed) — reuse existing entry if present, otherwise add it.
      const aiCategoryRaw = (aiData.category || "").trim();
      let resolvedCategory = formData.category;

      if (aiCategoryRaw) {
        const existingMatch = categories.find(
          (category) =>
            category.trim().toLowerCase() === aiCategoryRaw.toLowerCase()
        );

        if (existingMatch) {
          resolvedCategory = existingMatch;
        } else {
          resolvedCategory = aiCategoryRaw;
          setCategories((current) => {
            const alreadyExists = current.some(
              (category) =>
                category.trim().toLowerCase() === aiCategoryRaw.toLowerCase()
            );
            return alreadyExists ? current : [...current, aiCategoryRaw];
          });
        }
      }

      // Autofill form
      setFormData((prev) => ({
        ...prev,
        itemName: aiData.description || prev.itemName,
        category: resolvedCategory,
        color: aiData.colors?.join(", ") || prev.color,
        occasion: aiData.occasion || prev.occasion,
        season: aiData.season || prev.season,
        notes: aiData.description || prev.notes,
      }));
    } catch (error) {
      console.error(error);

      setAnalysisError(
        error.message || "AI analysis failed"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleAddCategory = () => {
    const trimmedCategory = newCategory.trim();

    if (!trimmedCategory || categories.includes(trimmedCategory)) {
      return;
    }

    setCategories((current) => [...current, trimmedCategory]);
    setFormData((current) => ({
      ...current,
      category: trimmedCategory,
    }));
    setNewCategory("");
  };
  
  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();
    
    if (selectedFile) {
  formDataToSend.append("image", selectedFile);
}
    formDataToSend.append("name", formData.itemName);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("color", formData.color);
    formDataToSend.append("occasion", formData.occasion);
    formDataToSend.append("season", formData.season);
    formDataToSend.append("notes", formData.notes);
    formDataToSend.append("description", aiMetadata.description);
    formDataToSend.append("subCategory", aiMetadata.subCategory || "");
    formDataToSend.append("colors", JSON.stringify(aiMetadata.colors));
    formDataToSend.append("pattern", aiMetadata.pattern);
    formDataToSend.append("fabric", aiMetadata.material);
    formDataToSend.append("sleeve", aiMetadata.sleeveLength);
    formDataToSend.append("fit", aiMetadata.fit);
    formDataToSend.append("brand", aiMetadata.brand);
    formDataToSend.append("confidence", aiMetadata.confidence || 0);
    formDataToSend.append("aiGenerated", true);

    if (isEditMode) {
      await axios.put(
        `http://localhost:5000/api/clothes/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Item Updated Successfully!");
    } else {
      await axios.post(
        "http://localhost:5000/api/clothes",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Item Added Successfully!");
    }

    window.location.href = "/wardrobe";
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Operation failed"
    );
  }
};

  return (
    <>
      <style>{`
        @keyframes addGlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.72; }
          50% { transform: scale(1.08) translateY(-10px); opacity: 1; }
        }
        @keyframes addFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(14px, -18px, 0); }
        }
        @keyframes addTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes addParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.4); }
          30% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-42px) scale(1.05); }
        }
        @keyframes addShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes addLift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-6deg) scale(1); }
          50% { transform: translate3d(0, -12px, 0) rotate(-2deg) scale(1.03); }
        }
        @keyframes addSparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .add-title {
          background-size: 200% auto;
          animation: addShimmer 5s ease infinite;
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7] px-4 py-6 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,183,197,0.52) 0%, rgba(192,132,252,0.42) 35%, rgba(167,139,250,0.48) 55%, rgba(251,191,146,0.36) 75%, rgba(244,114,182,0.4) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at 82% 24%, rgba(251,191,146,0.28), transparent 22%), radial-gradient(circle at 56% 78%, rgba(244,114,182,0.22), transparent 28%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-[#C084FC]/50 blur-[110px]"
          style={{ animation: "addGlow 9s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#F472B6]/45 blur-[120px]"
          style={{ animation: "addGlow 11s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FBBF94]/35 blur-[120px]"
          style={{ animation: "addFloat 10s ease-in-out infinite" }}
        />

        {[
          { top: "10%", left: "12%", delay: "0s", size: "4px" },
          { top: "22%", left: "84%", delay: "1.1s", size: "3px" },
          { top: "38%", left: "92%", delay: "2.4s", size: "4px" },
          { top: "58%", left: "8%", delay: "0.8s", size: "3px" },
          { top: "76%", left: "86%", delay: "3s", size: "5px" },
          { top: "84%", left: "20%", delay: "1.9s", size: "3px" },
        ].map((star, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.85)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `addTwinkle 4s ease-in-out infinite ${star.delay}`,
            }}
          />
        ))}

        {[
          { top: "24%", left: "28%", delay: "0s" },
          { top: "36%", left: "70%", delay: "1.4s" },
          { top: "54%", left: "16%", delay: "2.7s" },
          { top: "66%", left: "74%", delay: "0.6s" },
          { top: "30%", left: "86%", delay: "1.9s" },
          { top: "74%", left: "48%", delay: "3.2s" },
        ].map((particle, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute h-1.5 w-1.5 rounded-full bg-white/90"
            style={{
              top: particle.top,
              left: particle.left,
              boxShadow: "0 0 10px rgba(255,255,255,0.75)",
              animation: `addParticle 5s ease-in-out infinite ${particle.delay}`,
            }}
          />
        ))}

        <main className="relative z-10 mx-auto max-w-6xl">
          <section className="mb-6 rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.34),rgba(192,132,252,0.22),transparent_72%)] blur-2xl"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.36),rgba(249,168,212,0.16),transparent_70%)] blur-xl"
                  />
                  {[
                    { top: "8%", left: "24%", size: "8px", delay: "0s" },
                    { top: "24%", left: "86%", size: "7px", delay: "0.9s" },
                    { top: "74%", left: "16%", size: "6px", delay: "1.4s" },
                    { top: "82%", left: "72%", size: "7px", delay: "2.1s" },
                    { top: "42%", left: "92%", size: "5px", delay: "2.8s" },
                    { top: "18%", left: "6%", size: "5px", delay: "1.7s" },
                  ].map((sparkle, index) => (
                    <div
                      key={index}
                      aria-hidden="true"
                      className="absolute rounded-full"
                      style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        width: sparkle.size,
                        height: sparkle.size,
                        background:
                          index % 2 === 0
                            ? "rgba(255,255,255,0.92)"
                            : "rgba(249,168,212,0.92)",
                        boxShadow:
                          index % 2 === 0
                            ? "0 0 14px rgba(255,255,255,0.8)"
                            : "0 0 14px rgba(249,168,212,0.75)",
                        animation: `addSparkle 3.6s ease-in-out infinite ${sparkle.delay}`,
                      }}
                    />
                  ))}
                  <img
                    src={logo}
                    alt="AuraFit AI logo"
                    className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_0_42px_rgba(192,132,252,0.58)] sm:h-48 sm:w-48"
                    style={{ animation: "addLift 5.5s ease-in-out infinite" }}
                  />
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
                    AuraFit AI
                  </p>
                  <h1 className="add-title mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
                    {isEditMode
                      ? "Edit Wardrobe Item"
                        : "Add New Wardrobe Item"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4C1D95]/82 sm:text-base">
                    Upload a piece, tag it beautifully, and expand your digital
                    wardrobe for smarter AuraFit recommendations later.
                  </p>
                </div>
              </div>

              <div className="hidden rounded-full border border-white/55 bg-white/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-md sm:block">
                Frontend Prototype
              </div>
            </div>
          </section>

          <form
            className="grid gap-6 lg:grid-cols-[1fr_0.95fr]"
            onSubmit={handleSubmit}
          >
            <section className="rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#6D28D9]">
                Image Upload
              </p>
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="mt-5 flex min-h-[22rem] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border-2 border-dashed border-[#C084FC]/45 bg-white/28 px-5 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition duration-300 hover:bg-white/38"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {imagePreview ? (
                  <div className="w-full">
                    <div className="overflow-hidden rounded-[1.5rem] border border-white/55 bg-white/35 p-3">
                      <img
                        src={imagePreview}
                        alt="Wardrobe item preview"
                        className="h-72 w-full rounded-[1.2rem] object-cover"
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#6D28D9]">
                      {helperText}
                    </p>

                    {isAnalyzing && (
                      <p className="mt-4 text-center text-purple-700 font-semibold">
                      ✨ AuraFit AI is analyzing your clothing...
                     </p>
                    )}

                    {analysisError && (
                     <p className="mt-2 text-center text-red-500">
                      {analysisError}
                       </p>
                )}

                {aiMetadata.category && (
  <div className="mt-6 rounded-2xl border border-purple-200 bg-white/60 p-4">
    <h3 className="mb-3 text-lg font-bold text-purple-700">
      🤖 AI Detected Details
    </h3>

    <div className="grid grid-cols-2 gap-3 text-sm">

      <p className="col-span-2"><strong>Description:</strong> {aiMetadata.description || "-"}</p>

      <p><strong>Category:</strong> {aiMetadata.category}</p>

      <p><strong>Sub Category:</strong> {aiMetadata.subCategory || "-"}</p>

      <p><strong>Color:</strong> {aiMetadata.colors.join(", ")}</p>

      <p><strong>Season:</strong> {aiMetadata.season || "-"}</p>

      <p><strong>Occasion:</strong> {aiMetadata.occasion || "-"}</p>

      <p><strong>Material:</strong> {aiMetadata.material || "-"}</p>

      <p><strong>Pattern:</strong> {aiMetadata.pattern || "-"}</p>

      <p><strong>Sleeve:</strong> {aiMetadata.sleeveLength || "-"}</p>

      <p><strong>Fit:</strong> {aiMetadata.fit || "-"}</p>

      <p><strong>Brand:</strong> {aiMetadata.brand || "-"}</p>

      <p>
        <strong>Confidence:</strong>{" "}
        {aiMetadata.confidence
          ? `${Math.round(aiMetadata.confidence * 100)}%`
          : "-"}
      </p>

    </div>
  </div>
)}
                  </div>
                ) : (
                  <>
                    <div className="rounded-full border border-white/60 bg-white/38 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6D28D9]">
                      Drag & Drop
                    </div>
                    <h2 className="mt-5 text-2xl font-bold tracking-[-0.04em] text-[#2E1065]">
                      Upload your clothing image
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#4C1D95]/78">
                      Drop an image here or tap to browse. Transparent product
                      shots and well-lit wardrobe photos work beautifully.
                    </p>
                  </>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
              <div className="grid gap-5">
                <div>
                  <label
                    htmlFor="item-name"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Item Name
                  </label>
                  <input
                    id="item-name"
                    name="itemName"
                    type="text"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="Lavender satin shirt"
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${inputClassName} appearance-none`}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="new-category"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Add New Category
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="new-category"
                      type="text"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      placeholder="e.g. Ethnic Sets"
                      className={inputClassName}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="rounded-full border border-white/55 bg-white/35 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/55 sm:w-auto"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="color"
                      className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                    >
                      Color
                    </label>
                    <input
                      id="color"
                      name="color"
                      type="text"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Lavender"
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="occasion"
                      className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                    >
                      Occasion
                    </label>
                    <select
                      id="occasion"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleChange}
                      className={`${inputClassName} appearance-none`}
                    >
                      {occasionOptions.map((occasion) => (
                        <option key={occasion} value={occasion}>
                          {occasion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="season"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Season
                  </label>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className={`${inputClassName} appearance-none`}
                  >
                    {seasonOptions.map((season) => (
                      <option key={season} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-semibold text-[#4C1D95]"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="5"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Fabric details, fit notes, styling ideas, or anything you want AuraFit to remember later."
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                <div className="rounded-[1.5rem] border border-white/45 bg-white/28 p-4 text-sm leading-6 text-[#4C1D95]/80 backdrop-blur-md">
                  This is a prototype-only wardrobe entry form. You can test the
                  full UI flow without any backend, authentication, or database.
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-full border border-white/55 bg-white/35 px-6 py-3.5 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md transition hover:bg-white/55"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(124,58,237,0.35)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_20px_44px_rgba(124,58,237,0.45)] active:scale-[0.98]"
                  >
                    <span className="relative z-10">
                       {isEditMode ? "Update Item" : "Save Item"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                    />
                  </button>
                </div>
              </div>
            </section>
          </form>
        </main>
      </div>
    </>
  );
}

export default AddItem;