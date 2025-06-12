"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useOfflineStorage } from "@/hooks/use-offline-storage"

const TimeEventInput = ({ label, onChange, value }) => {
  const handleTimeChange = (e) => {
    onChange(e.target.value)
  }

  const setTimeToNow = () => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    onChange(currentTime)
  }

  // If no value is set, show only the "Set to Now" button
  if (!value) {
    return (
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        <Label htmlFor={label} className="text-base font-medium sm:w-1/3">
          {label}
        </Label>
        <div className="sm:w-2/3">
          <Button type="button" onClick={setTimeToNow} className="w-full h-12 text-base">
            Set to Now
          </Button>
        </div>
      </div>
    )
  }

  // If value is set, show normal layout with input field and button
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
      <Label htmlFor={label} className="text-base font-medium sm:w-1/3">
        {label}
      </Label>
      <Input type="time" id={label} value={value || ""} onChange={handleTimeChange} className="text-lg h-12 sm:w-1/3" />
      <Button type="button" onClick={setTimeToNow} className="h-12 text-base sm:w-1/3">
        Set to Now
      </Button>
    </div>
  )
}

const CatheterInput = ({ label, onChange, value }) => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
      <Label htmlFor={label} className="text-base font-medium sm:w-1/3">
        {label}
      </Label>
      <Input
        type="text"
        id={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Model"
        className="text-lg h-12 sm:w-2/3"
      />
    </div>
  )
}

const CustomSelectInput = ({ label, options, value, onChange, name, onAddCustom }) => {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customValue, setCustomValue] = useState("")

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value
    if (selectedValue === "CUSTOM" && onAddCustom) {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      onChange(e)
    }
  }

  const handleCustomSubmit = () => {
    if (customValue.trim() && onAddCustom) {
      onAddCustom(customValue.trim())
      onChange({ target: { name, value: customValue.trim() } })
      setCustomValue("")
      setShowCustomInput(false)
    }
  }

  const handleCustomCancel = () => {
    setShowCustomInput(false)
    setCustomValue("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCustomSubmit()
    }
  }

  return (
    <div>
      <Label htmlFor={name} className="text-base font-medium">
        {label}
      </Label>
      {!showCustomInput ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleSelectChange}
          className="w-full mt-2 p-3 text-lg border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select {label}</option>
          {Object.entries(options).map(([key, value]) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
          {onAddCustom && <option value="CUSTOM">+ Add Custom {label}</option>}
        </select>
      ) : (
        <div className="mt-2 space-y-3">
          <Input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Enter custom ${label.toLowerCase()}`}
            className="w-full text-lg h-12"
            autoFocus
          />
          <div className="flex space-x-2">
            <Button type="button" onClick={handleCustomSubmit} className="flex-1 h-12 text-base">
              Add
            </Button>
            <Button type="button" onClick={handleCustomCancel} variant="outline" className="flex-1 h-12 text-base">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

const SelectInput = ({ label, options, value, onChange, name }) => {
  return (
    <div>
      <Label htmlFor={name} className="text-base font-medium">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 p-3 text-lg border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">Select {label}</option>
        {Object.entries(options).map(([key, value]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  )
}

const MultiSelectCheckboxes = ({ label, options, selectedValues, onChange }) => {
  const handleCheckboxChange = (option) => {
    const newSelectedValues = { ...selectedValues }
    newSelectedValues[option] = !selectedValues[option]
    onChange(newSelectedValues)
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{label}</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 p-4 border border-gray-300 rounded-md">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3">
            <Checkbox
              id={`checkbox-${option}`}
              checked={selectedValues[option] || false}
              onCheckedChange={() => handleCheckboxChange(option)}
              className="w-5 h-5"
            />
            <Label htmlFor={`checkbox-${option}`} className="cursor-pointer text-base">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generate a unique device ID
const generateDeviceId = () => {
  return "device_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get device ID from localStorage or generate a new one
const getDeviceId = () => {
  if (typeof window === "undefined") return ""

  try {
    // Check if localStorage is available (Safari private mode blocks it)
    if (typeof Storage === "undefined" || !window.localStorage) {
      return generateDeviceId() // Return a session-only ID
    }

    let deviceId = localStorage.getItem("afAblation_deviceId")
    if (!deviceId) {
      deviceId = generateDeviceId()
      localStorage.setItem("afAblation_deviceId", deviceId)
    }
    return deviceId
  } catch (error) {
    console.error("Error accessing localStorage (Safari private mode?):", error)
    return generateDeviceId() // Fallback to a new ID if localStorage fails
  }
}

// Updated function to generate procedure names in the new format
const generateProcedureName = (epName, hospitalName, date, procedureNumber) => {
  const shortHospital = hospitalName || "Hospital"
  const shortEpName = epName || "EP"
  const formattedDate = new Date(date)
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".")
  return `${shortHospital}_${shortEpName}_${formattedDate}_PN${procedureNumber}`
}

const ProcedureForm = ({ onExport }) => {
  const initialFormState = {
    accountName: "",
    epName: "",
    procedureType: "AF Ablation", // Set default to AF Ablation
    mappingSystem: "",
    timeEvents: {},
    catheters: {},
    equipment: {},
    fluoroTime: "",
    applications: "",
    lesionSets: {
      PVI: true, // Keep PVI checked by default
      PWI: false,
      MI: false,
      CTI: false,
      SVC: false,
      SVT: false,
    },
  }

  const [formData, setFormData] = useState(initialFormState)
  const [toastMessage, setToastMessage] = useState("")
  const [customAccounts, setCustomAccounts] = useState({})
  const [customEPs, setCustomEPs] = useState({})
  const [customEPPreferences, setCustomEPPreferences] = useState({})
  const [isClient, setIsClient] = useState(false)
  const [hasChangedFromDefaults, setHasChangedFromDefaults] = useState(false)
  const [deviceId, setDeviceId] = useState("")
  const [showBasicInfo, setShowBasicInfo] = useState(false)
  const [showLesionSets, setShowLesionSets] = useState(false)
  const [showEquipment, setShowEquipment] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [showHelp, setShowHelp] = useState(false)
  const [showEpManagementModal, setShowEpManagementModal] = useState(false)
  const [recentEPs, setRecentEPs] = useState([])
  const [recentHospitalsByEP, setRecentHospitalsByEP] = useState({})
  const [epHospitalAssociations, setEpHospitalAssociations] = useState({})
  const [showAllEPs, setShowAllEPs] = useState(true)

  const [procedureInstances, setProcedureInstances] = useState([
    {
      id: 1,
      name: "Procedure 1",
      timeEvents: {},
      fluoroTime: "",
      applications: "",
      epName: "",
      accountName: "",
    },
  ])
  const [currentInstanceId, setCurrentInstanceId] = useState(1)

  // Set client flag and device ID after component mounts
  useEffect(() => {
    setIsClient(true)
    setDeviceId(getDeviceId())
    // Set current date
    const today = new Date()
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }, [])

  // Load saved data and custom options from localStorage on component mount
  useEffect(() => {
    if (!isClient || !deviceId) return

    // Load form data for this device
    try {
      const savedData = localStorage.getItem(`afAblationFormData_${deviceId}`)
      if (savedData) {
        const parsedData = JSON.parse(savedData)

        const updatedData = {
          ...parsedData,
          fluoroTime: parsedData.fluoroTime || 0,
          applications: parsedData.applications || 0,
          equipment: parsedData.equipment || {},
          lesionSets: {
            PVI: true,
            PWI: false,
            MI: false,
            CTI: false,
            SVC: false,
            SVT: false,
            ...(parsedData.lesionSets || {}),
          },
        }

        // Load procedure instances if they exist
        if (parsedData.procedureInstances) {
          setProcedureInstances(parsedData.procedureInstances)
          setCurrentInstanceId(parsedData.currentInstanceId || parsedData.procedureInstances[0]?.id || 1)
        }

        setFormData(updatedData)
        setToastMessage("Your previous session data has been loaded.")
        setTimeout(() => setToastMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error parsing saved data:", error)
    }

    // Load custom accounts for this device
    try {
      const savedAccounts = localStorage.getItem(`customAccounts_${deviceId}`)
      if (savedAccounts) {
        setCustomAccounts(JSON.parse(savedAccounts))
      }
    } catch (error) {
      console.error("Error parsing custom accounts:", error)
    }

    // Load custom EPs for this device
    try {
      const savedEPs = localStorage.getItem(`customEPs_${deviceId}`)
      if (savedEPs) {
        setCustomEPs(JSON.parse(savedEPs))
      }
    } catch (error) {
      console.error("Error parsing custom EPs:", error)
    }

    // Load custom EP preferences for this device
    try {
      const savedPreferences = localStorage.getItem(`customEPPreferences_${deviceId}`)
      if (savedPreferences) {
        setCustomEPPreferences(JSON.parse(savedPreferences))
      }
    } catch (error) {
      console.error("Error parsing custom EP preferences:", error)
    }

    // Load recent usage data
    try {
      const savedRecentEPs = localStorage.getItem(`recentEPs_${deviceId}`)
      if (savedRecentEPs) {
        setRecentEPs(JSON.parse(savedRecentEPs))
      }
    } catch (error) {
      console.error("Error parsing recent EPs:", error)
    }

    try {
      const savedRecentHospitals = localStorage.getItem(`recentHospitalsByEP_${deviceId}`)
      if (savedRecentHospitals) {
        setRecentHospitalsByEP(JSON.parse(savedRecentHospitals))
      }
    } catch (error) {
      console.error("Error parsing recent hospitals:", error)
    }

    // Load EP-hospital associations
    try {
      const savedAssociations = localStorage.getItem(`epHospitalAssociations_${deviceId}`)
      if (savedAssociations) {
        setEpHospitalAssociations(JSON.parse(savedAssociations))
      }
    } catch (error) {
      console.error("Error parsing EP-hospital associations:", error)
    }
  }, [isClient, deviceId])

  // Auto-save data to localStorage whenever formData or procedureInstances changes
  useEffect(() => {
    if (!isClient || !deviceId) return

    const saveTimeout = setTimeout(() => {
      try {
        const dataToSave = {
          ...formData,
          procedureInstances,
          currentInstanceId,
        }
        localStorage.setItem(`afAblationFormData_${deviceId}`, JSON.stringify(dataToSave))
      } catch (error) {
        console.error("Error saving form data:", error)
      }
    }, 1000)

    return () => clearTimeout(saveTimeout)
  }, [formData, procedureInstances, currentInstanceId, isClient, deviceId])

  // Save custom options to localStorage
  useEffect(() => {
    if (!isClient || !deviceId) return

    try {
      localStorage.setItem(`customAccounts_${deviceId}`, JSON.stringify(customAccounts))
    } catch (error) {
      console.error("Error saving custom accounts:", error)
    }
  }, [customAccounts, isClient, deviceId])

  useEffect(() => {
    if (!isClient || !deviceId) return

    try {
      localStorage.setItem(`customEPs_${deviceId}`, JSON.stringify(customEPs))
    } catch (error) {
      console.error("Error saving custom EPs:", error)
    }
  }, [customEPs, isClient, deviceId])

  useEffect(() => {
    if (!isClient || !deviceId) return

    try {
      localStorage.setItem(`customEPPreferences_${deviceId}`, JSON.stringify(customEPPreferences))
    } catch (error) {
      console.error("Error saving custom EP preferences:", error)
    }
  }, [customEPPreferences, isClient, deviceId])

  useEffect(() => {
    if (!isClient || !deviceId) return
    try {
      localStorage.setItem(`recentEPs_${deviceId}`, JSON.stringify(recentEPs))
    } catch (error) {
      console.error("Error saving recent EPs:", error)
    }
  }, [recentEPs, isClient, deviceId])

  useEffect(() => {
    if (!isClient || !deviceId) return
    try {
      localStorage.setItem(`recentHospitalsByEP_${deviceId}`, JSON.stringify(recentHospitalsByEP))
    } catch (error) {
      console.error("Error saving recent hospitals:", error)
    }
  }, [recentHospitalsByEP, isClient, deviceId])

  // Save EP-hospital associations
  useEffect(() => {
    if (!isClient || !deviceId) return
    try {
      localStorage.setItem(`epHospitalAssociations_${deviceId}`, JSON.stringify(epHospitalAssociations))
    } catch (error) {
      console.error("Error saving EP-hospital associations:", error)
    }
  }, [epHospitalAssociations, isClient, deviceId])

  // Check if current values differ from EP defaults
  useEffect(() => {
    if (formData.epName) {
      const epPreferences = customEPPreferences[formData.epName]
      if (epPreferences) {
        const currentEquipment = formData.equipment || {}
        const savedEquipment = epPreferences.equipment || {}

        const hasChanges =
          formData.mappingSystem !== epPreferences.mappingSystem ||
          currentEquipment.sheath1 !== savedEquipment.sheath1 ||
          currentEquipment.sheath2 !== savedEquipment.sheath2 ||
          currentEquipment.mappingCatheter !== savedEquipment.mappingCatheter ||
          currentEquipment.transseptalTool !== savedEquipment.transseptalTool ||
          currentEquipment.iceCatheter !== savedEquipment.iceCatheter

        setHasChangedFromDefaults(hasChanges)
      }
    } else {
      setHasChangedFromDefaults(false)
    }
  }, [formData.epName, formData.mappingSystem, formData.equipment, customEPPreferences])

  // Auto-rename ALL procedures when EP name, hospital, or date changes
  // useEffect(() => {
  //   if (formData.epName || formData.accountName) {
  //     setProcedureInstances((prev) =>
  //       prev.map((procedure, index) => ({
  //         ...procedure,
  //         name: generateProcedureName(formData.epName, formData.accountName, currentDate, index + 1),
  //       })),
  //     )
  //   }
  // }, [formData.epName, formData.accountName, currentDate])

  // Track EP usage
  const trackEPUsage = (epName) => {
    if (!epName) return
    setRecentEPs((prev) => {
      const filtered = prev.filter((name) => name !== epName)
      return [epName, ...filtered].slice(0, 10) // Keep last 10
    })
  }

  // Track hospital usage for specific EP
  const trackHospitalUsage = (epName, hospitalName) => {
    if (!epName || !hospitalName) return
    setRecentHospitalsByEP((prev) => {
      const epHospitals = prev[epName] || []
      const filtered = epHospitals.filter((name) => name !== hospitalName)
      return {
        ...prev,
        [epName]: [hospitalName, ...filtered].slice(0, 10), // Keep last 10
      }
    })
  }

  const getSortedEPNames = () => {
    const allEPs = { ...defaultEpNames, ...customEPs }

    let filteredEPs = allEPs

    // Filter EPs by hospital association if a hospital is selected and "Show All EPs" is off
    if (!showAllEPs && formData.accountName) {
      filteredEPs = {}
      Object.keys(allEPs).forEach((epName) => {
        const epHospitals = epHospitalAssociations[epName] || []
        if (epHospitals.includes(formData.accountName)) {
          filteredEPs[epName] = allEPs[epName]
        }
      })
    }

    const sortedKeys = Object.keys(filteredEPs).sort((a, b) => {
      const aIndex = recentEPs.indexOf(a)
      const bIndex = recentEPs.indexOf(b)

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

    const result = {}
    sortedKeys.forEach((key) => {
      result[key] = filteredEPs[key]
    })
    return result
  }

  // Sort hospitals by recent usage for current EP
  const getSortedHospitals = () => {
    const allHospitals = { ...defaultAccountOptions, ...customAccounts }
    if (!formData.epName) return allHospitals

    const recentForEP = recentHospitalsByEP[formData.epName] || []
    const sortedKeys = Object.keys(allHospitals).sort((a, b) => {
      const aIndex = recentForEP.indexOf(a)
      const bIndex = recentForEP.indexOf(b)

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

    const result = {}
    sortedKeys.forEach((key) => {
      result[key] = allHospitals[key]
    })
    return result
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Track usage and rename procedures immediately
    if (name === "epName" && value) {
      trackEPUsage(value)

      // Rename all procedures immediately, preserving their original procedure numbers
      setProcedureInstances((prev) =>
        prev.map((procedure) => {
          // Extract the original procedure number from the current name or use the ID
          const procedureNumber = procedure.name.match(/_PN(\d+)$/)
            ? procedure.name.match(/_PN(\d+)$/)[1]
            : procedure.id
          return {
            ...procedure,
            name: generateProcedureName(value, formData.accountName, currentDate, procedureNumber),
            epName: value,
          }
        }),
      )

      const epPreferences = getEPPreferences(value)
      if (epPreferences) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          mappingSystem: epPreferences.mappingSystem || prev.mappingSystem,
          equipment: {
            ...prev.equipment,
            ...epPreferences.equipment,
          },
        }))
      }
    }

    if (name === "accountName" && value) {
      trackHospitalUsage(formData.epName, value)

      // Rename all procedures immediately, preserving their original procedure numbers
      setProcedureInstances((prev) =>
        prev.map((procedure) => {
          // Extract the original procedure number from the current name or use the ID
          const procedureNumber = procedure.name.match(/_PN(\d+)$/)
            ? procedure.name.match(/_PN(\d+)$/)[1]
            : procedure.id
          return {
            ...procedure,
            name: generateProcedureName(formData.epName, value, currentDate, procedureNumber),
            accountName: value,
          }
        }),
      )
    }
  }

  const handleTimeEventChange = (event, time) => {
    setFormData((prev) => ({
      ...prev,
      timeEvents: { ...prev.timeEvents, [event]: time },
    }))
  }

  const handleCatheterChange = (catheter, model) => {
    setFormData((prev) => ({
      ...prev,
      catheters: { ...prev.catheters, [catheter]: model },
    }))
  }

  const handleEquipmentChange = (equipment, model) => {
    setFormData((prev) => ({
      ...prev,
      equipment: { ...prev.equipment, [equipment]: model },
    }))
  }

  const handleFluoroTimeChange = (e) => {
    const value = e.target.value === "" ? "" : Number.parseFloat(e.target.value) || ""
    setFormData((prev) => ({
      ...prev,
      fluoroTime: value,
    }))
  }

  const handleApplicationsChange = (e) => {
    const value = e.target.value === "" ? "" : Number.parseInt(e.target.value) || ""
    setFormData((prev) => ({
      ...prev,
      applications: value,
    }))
  }

  const handleLesionSetsChange = (newLesionSets) => {
    setFormData((prev) => ({
      ...prev,
      lesionSets: newLesionSets,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const exportData = {
      ...formData,
      procedureInstances,
      totalFluoroTime: procedureInstances.reduce((sum, p) => sum + (p.fluoroTime || 0), 0),
      totalApplications: procedureInstances.reduce((sum, p) => sum + (p.applications || 0), 0),
    }
    onExport(exportData)
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
      // Check if current values differ from EP template before resetting
      if (formData.epName) {
        const epPreferences = customEPPreferences[formData.epName]
        if (epPreferences) {
          const currentEquipment = formData.equipment || {}
          const savedEquipment = epPreferences.equipment || {}

          const hasBasicInfoChanges = formData.mappingSystem !== epPreferences.mappingSystem
          const hasEquipmentChanges =
            currentEquipment.sheath1 !== savedEquipment.sheath1 ||
            currentEquipment.sheath2 !== savedEquipment.sheath2 ||
            currentEquipment.mappingCatheter !== savedEquipment.mappingCatheter ||
            currentEquipment.transseptalTool !== savedEquipment.transseptalTool ||
            currentEquipment.iceCatheter !== savedEquipment.iceCatheter

          if (hasBasicInfoChanges || hasEquipmentChanges) {
            const updateTemplate = window.confirm(
              `Your current settings differ from the saved template for ${formData.epName}. Would you like to update the template with your current settings before resetting?`,
            )
            if (updateTemplate) {
              handleUpdateEPDefaults()
            }
          }
        }
      }

      if (isClient && deviceId) {
        try {
          localStorage.removeItem(`afAblationFormData_${deviceId}`)
        } catch (error) {
          console.error("Error removing form data:", error)
        }
      }
      setFormData(initialFormState)
      setProcedureInstances([
        {
          id: 1,
          name: generateProcedureName("", "", currentDate, 1),
          timeEvents: {},
          fluoroTime: 0,
          applications: 0,
          epName: "",
          accountName: "",
        },
      ])
      setCurrentInstanceId(1)
      setToastMessage("All form data has been cleared.")
      setTimeout(() => setToastMessage(""), 3000)
    }
  }

  const handleUpdateEPDefaults = () => {
    if (!formData.epName) return

    const newPreferences = {
      mappingSystem: formData.mappingSystem,
      equipment: {
        sheath1: formData.equipment?.sheath1 || "",
        sheath2: formData.equipment?.sheath2 || "",
        mappingCatheter: formData.equipment?.mappingCatheter || "",
        transseptalTool: formData.equipment?.transseptalTool || "",
        iceCatheter: formData.equipment?.iceCatheter || "",
      },
    }

    setCustomEPPreferences((prev) => ({
      ...prev,
      [formData.epName]: newPreferences,
    }))

    setToastMessage(`Updated default preferences for ${formData.epName}.`)
    setTimeout(() => setToastMessage(""), 3000)
    setHasChangedFromDefaults(false)
  }

  const handleSaveAsEPDefault = () => {
    if (!formData.epName) {
      setToastMessage("Please select an EP name first.")
      setTimeout(() => setToastMessage(""), 3000)
      return
    }

    const newPreferences = {
      mappingSystem: formData.mappingSystem,
      equipment: {
        sheath1: formData.equipment?.sheath1 || "",
        sheath2: formData.equipment?.sheath2 || "",
        mappingCatheter: formData.equipment?.mappingCatheter || "",
        transseptalTool: formData.equipment?.transseptalTool || "",
        iceCatheter: formData.equipment?.iceCatheter || "",
      },
    }

    setCustomEPPreferences((prev) => ({
      ...prev,
      [formData.epName]: newPreferences,
    }))

    // Track EP-hospital association
    if (formData.accountName) {
      setEpHospitalAssociations((prev) => ({
        ...prev,
        [formData.epName]: [...new Set([...(prev[formData.epName] || []), formData.accountName])],
      }))
    }

    setToastMessage(`Saved current settings as default template for ${formData.epName}.`)
    setTimeout(() => setToastMessage(""), 3000)
    setHasChangedFromDefaults(false)
  }

  const addCustomAccount = (accountName) => {
    const newId = Date.now() // Simple ID generation
    setCustomAccounts((prev) => ({
      ...prev,
      [accountName]: newId,
    }))
    setToastMessage(`Added "${accountName}" to account options.`)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const addCustomEP = (epName) => {
    const newId = Date.now().toString() // Simple ID generation
    setCustomEPs((prev) => ({
      ...prev,
      [epName]: newId,
    }))
    setToastMessage(`Added "${epName}" to EP options.`)
    setTimeout(() => setToastMessage(""), 3000)
  }

  // Get EP preferences (only from custom preferences)
  const getEPPreferences = (epName) => {
    return customEPPreferences[epName] || null
  }

  const defaultAccountOptions = {
    Northside: 14717,
    AHT: 24485,
    Largo: 18349,
    SMH: 18529,
    Bayonet: 10883,
    MPH: 19327,
    Blake: 11205,
    SJH: 20001,
    "NCH North": 20002,
    "NCH Baker": 20003,
    PRMC: 20004,
    Brandon: 20005,
    Bayfront: 20006,
    Lakeland: 20007,
    AHNP: 20008,
    TGH: 20009,
    Fawcett: 20010,
    Healthpark: 20011,
  }

  const defaultEpNames = {
    "Robert Sheppard": "1578525937",
    "Giancarlo Speziani": "1609079011",
    "Mina Ghobrial": "1285059170",
    "Paul Gerczuk": "1619291994",
    "Iosef Kelesidis": "1013154111",
    "Marshall Marcus": "1609160563",
    "Kenneth Yamamura": "1083603989",
    "Francisco Cardona": "1588626410",
    "James Irwin": "1669418901",
    "Kelvin Lau": "2000000001",
    "Matthew Klein": "2000000002",
    "Daniel Masvidal": "2000000003",
    "Satish Velagapudi": "2000000004",
    "Arun Rao": "2000000005",
    "Anant Kharod": "2000000006",
    "Jared Collins": "2000000007",
    "Rachael Venn": "2000000008",
    "Sidney Peykar": "2000000009",
    "Smriti Banthia": "2000000010",
    "Anuj Agarwal": "2000000011",
    "Christian Perzanowski": "2000000012",
    "Allan Welter-Frost": "2000000013",
    "Andrea Tordini": "2000000014",
    "Bengt Herweg": "2000000015",
    "Bosede Afolabi": "2000000016",
    "Brian Betensky": "2000000017",
    "Christopher Cook": "2000000018",
    "Daniel Friedman": "2000000019",
    "Darshan Patel": "2000000020",
    "David Wilson": "2000000021",
    "Dilip Mathew": "2000000022",
    "Dinesh Sharma": "2000000023",
    "Erick Burton": "2000000024",
    "Fahd Nadeem": "2000000025",
    "Jeffrey Brumfield": "2000000026",
    "John Norris": "2000000027",
    "Juan Garcia-Morell": "2000000028",
    "Kevin Makati": "2000000029",
    "Likhitesh Jaikumar": "2000000030",
    "Luis Annoni-Suau": "2000000031",
    "Martin Espinosa": "2000000032",
    "Nicholas Kotch": "2000000033",
    "Oladele Fabunmi": "2000000034",
    "Rajesh Malik": "2000000035",
    "Raul Jimenez": "2000000036",
    "Ritesh S Patel": "2000000037",
    "Robert Eckart": "2000000038",
    "Roshan Vatthyam": "2000000039",
    "Shalin Shah": "2000000040",
    "Vaibhav Moondra": "2000000041",
  }

  const procedureTypes = {
    "AF Ablation": 1,
    "VT Ablation": 2,
    "SVT Ablation": 3,
  }

  const mappingSystems = {
    CARTO: 1,
    ENSITE: 2,
    "OPAL/FARAVIEW": 3,
  }

  const lesionSetOptions = ["PVI", "PWI", "MI", "CTI", "SVC", "SVT"]

  // Combine default and custom options
  const accountOptions = { ...defaultAccountOptions, ...customAccounts }
  const epNames = { ...defaultEpNames, ...customEPs }

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">AF Ablation Procedure Recorder</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {toastMessage && (
        <div className="bg-blue-100 p-4 rounded-md mb-4">
          <p className="text-blue-800 text-base">{toastMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">{currentDate}</p>
        </div>

        {/* Help Instructions - Collapsible */}
        <div className="border border-blue-200 rounded-lg bg-blue-50">
          <Button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100 h-12"
          >
            <span className="font-medium text-base text-blue-800">📱 Setup & Quick Start Guide</span>
            {showHelp ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </Button>
          {showHelp && (
            <div className="px-4 pb-4 space-y-4 border-t border-blue-200 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">📱 Add to iPhone Home Screen</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>
                    Open this link in <strong>Safari</strong> on your iPhone
                  </li>
                  <li>
                    Tap the <strong>Share button</strong> (square with arrow) → <strong>"Add to Home Screen"</strong> →{" "}
                    <strong>"Add"</strong>
                  </li>
                </ol>
                <p className="text-xs text-blue-600 mt-2">
                  The app icon will appear on your home screen like any other app!
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">🚀 Quick Start</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>
                    Select your <strong>EP name</strong> and hospital below
                  </li>
                  <li>
                    After filling in default information, Hit <strong>"Save as Template"</strong> to save EP preferences for next time.
                  </li>
                  <li>Add procedures as needed throughout your day</li>
                  <li>
                    Log times by tapping <strong>"Set to Now"</strong> buttons
                  </li>
                  <li>
                    Save data at end of day → choose <strong>"Save to Photos"</strong>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">💡 Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
                  <li>
                    <strong>Works offline</strong> - no internet needed during procedures
                  </li>
                  <li>
                    <strong>Auto-saves</strong> - never lose your data
                  </li>
                  <li>
                    <strong>Multiple procedures</strong> - track several cases per day
                  </li>
                  <li>
                    <strong>Photo export</strong> - organized summary saved to Photos app
                  </li>
                  <li>
                    <strong>Salesforce export</strong> - direct integration when online
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-800 mb-2">🔧 Pro Tips</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
                  <li>Set up your EP template once, reuse daily</li>
                  <li>Use "Set to Now" buttons for accurate timing</li>
                  <li>App remembers everything between sessions</li>
                  <li>Works in airplane mode/poor signal areas</li>
                </ul>
              </div>

              <div className="bg-blue-100 p-3 rounded border border-blue-300">
                <p className="text-xs text-blue-800">
                  <strong>📝 Feedback:</strong> Found a bug or have a suggestion? This is a beta test - your feedback
                  helps improve the app for everyone!
                  <br />
                  <span className="text-blue-600">Contact: [813-731-6534 Derek O'Hara] </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <CustomSelectInput
            label="Hospital"
            options={getSortedHospitals()}
            value={formData.accountName}
            onChange={handleInputChange}
            name="accountName"
            onAddCustom={addCustomAccount}
          />

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">EP Name</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowAllEPs(!showAllEPs)}
                  variant="outline"
                  className="h-8 text-xs"
                >
                  {showAllEPs ? "Filter by Hospital" : "Show All EPs"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowEpManagementModal(true)}
                  variant="outline"
                  className="h-8 text-xs"
                >
                  Manage EP List
                </Button>
              </div>
            </div>
            {!showAllEPs && formData.accountName && (
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                Showing EPs associated with {formData.accountName}
              </div>
            )}
            <CustomSelectInput
              label=""
              options={getSortedEPNames()}
              value={formData.epName}
              onChange={handleInputChange}
              name="epName"
              onAddCustom={addCustomEP}
            />
          </div>

          <Button
            type="button"
            onClick={handleSaveAsEPDefault}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base"
            disabled={!formData.epName}
          >
            Save as Template
          </Button>
        </div>

        {/* Multiple Procedures */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h3 className="text-xl font-semibold">Procedures</h3>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white h-12 text-base">
                Save...
              </Button>
              <Button
                type="button"
                onClick={() => {
                  const newId = Math.max(...procedureInstances.map((p) => p.id)) + 1
                  const newProcedure = {
                    id: newId,
                    name: generateProcedureName(formData.epName, formData.accountName, currentDate, newId),
                    timeEvents: {},
                    fluoroTime: "",
                    applications: "",
                    epName: formData.epName, // Store the EP name with this procedure
                    accountName: formData.accountName, // Store the account name with this procedure
                  }
                  setProcedureInstances((prev) => [...prev, newProcedure])
                  setCurrentInstanceId(newId)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
              >
                + Add Procedure
              </Button>
            </div>
          </div>

          {/* Procedure Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {procedureInstances.map((procedure) => (
              <Button
                key={procedure.id}
                type="button"
                onClick={() => setCurrentInstanceId(procedure.id)}
                variant={currentInstanceId === procedure.id ? "default" : "outline"}
                className={`relative text-sm h-10 ${currentInstanceId === procedure.id ? "bg-blue-600 text-white" : ""}`}
              >
                {procedure.name}
                {procedureInstances.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm(`Delete ${procedure.name}?`)) {
                        setProcedureInstances((prev) => {
                          const filtered = prev.filter((p) => p.id !== procedure.id)
                          if (filtered.length === 0) {
                            return [
                              {
                                id: 1,
                                name: "Procedure 1",
                                timeEvents: {},
                                fluoroTime: 0,
                                applications: 0,
                                epName: "",
                                accountName: "",
                              },
                            ]
                          }
                          return filtered
                        })
                        if (currentInstanceId === procedure.id) {
                          const remaining = procedureInstances.filter((p) => p.id !== procedure.id)
                          setCurrentInstanceId(remaining.length > 0 ? remaining[0].id : 1)
                        }
                      }
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </Button>
            ))}
          </div>

          {/* Current Procedure Content - Mobile Optimized */}
          {(() => {
            const currentProcedure = procedureInstances.find((p) => p.id === currentInstanceId)
            if (!currentProcedure) return null

            return (
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="space-y-6">
                  {/* Procedure Name */}
                  <div className="space-y-2">
                    <Label htmlFor="procedureName" className="text-base font-medium">
                      Procedure Name
                    </Label>
                    <Input
                      id="procedureName"
                      value={currentProcedure.name}
                      onChange={(e) => {
                        setProcedureInstances((prev) =>
                          prev.map((p) => (p.id === currentInstanceId ? { ...p, name: e.target.value } : p)),
                        )
                      }}
                      className="w-full font-mono text-sm h-12"
                    />
                  </div>

                  {/* Time Events - Mobile Optimized */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4 text-lg">Time Events</h4>
                    <div className="space-y-4">
                      <TimeEventInput
                        label="Groin Access"
                        value={currentProcedure.timeEvents?.groinAccess || ""}
                        onChange={(time) => {
                          setProcedureInstances((prev) =>
                            prev.map((p) =>
                              p.id === currentInstanceId
                                ? { ...p, timeEvents: { ...p.timeEvents, groinAccess: time } }
                                : p,
                            ),
                          )
                        }}
                      />
                      <TimeEventInput
                        label="Transseptal Puncture"
                        value={currentProcedure.timeEvents?.transseptalPuncture || ""}
                        onChange={(time) => {
                          setProcedureInstances((prev) =>
                            prev.map((p) =>
                              p.id === currentInstanceId
                                ? { ...p, timeEvents: { ...p.timeEvents, transseptalPuncture: time } }
                                : p,
                            ),
                          )
                        }}
                      />
                      <TimeEventInput
                        label="FARAWAVE Insertion"
                        value={currentProcedure.timeEvents?.farawaveInsertion || ""}
                        onChange={(time) => {
                          setProcedureInstances((prev) =>
                            prev.map((p) =>
                              p.id === currentInstanceId
                                ? { ...p, timeEvents: { ...p.timeEvents, farawaveInsertion: time } }
                                : p,
                            ),
                          )
                        }}
                      />
                      <TimeEventInput
                        label="FARAWAVE Removal"
                        value={currentProcedure.timeEvents?.farawaveRemoval || ""}
                        onChange={(time) => {
                          setProcedureInstances((prev) =>
                            prev.map((p) =>
                              p.id === currentInstanceId
                                ? { ...p, timeEvents: { ...p.timeEvents, farawaveRemoval: time } }
                                : p,
                            ),
                          )
                        }}
                      />
                      <TimeEventInput
                        label="FARADRIVE Removal"
                        value={currentProcedure.timeEvents?.faradriveRemoval || ""}
                        onChange={(time) => {
                          setProcedureInstances((prev) =>
                            prev.map((p) =>
                              p.id === currentInstanceId
                                ? { ...p, timeEvents: { ...p.timeEvents, faradriveRemoval: time } }
                                : p,
                            ),
                          )
                        }}
                      />
                      <TimeEventInput
                        label="Groin Closure"
                        value={currentProcedure.timeEvents?.groinClosure || ""}
                        onChange={(time) => {
                          setProcedureInstances((prev) =>
                            prev.map((p) =>
                              p.id === currentInstanceId
                                ? { ...p, timeEvents: { ...p.timeEvents, groinClosure: time } }
                                : p,
                            ),
                          )
                        }}
                      />
                    </div>
                  </div>

                  {/* Procedure Metrics - Mobile Optimized */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-4 text-lg">Procedure Metrics</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fluoroTime" className="text-base font-medium">
                          Fluoro Time (min)
                        </Label>
                        <Input
                          type="number"
                          id="fluoroTime"
                          value={currentProcedure.fluoroTime}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseFloat(e.target.value) || ""
                            setProcedureInstances((prev) =>
                              prev.map((p) => (p.id === currentInstanceId ? { ...p, fluoroTime: value } : p)),
                            )
                          }}
                          min="0"
                          step="0.1"
                          placeholder="0.0"
                          className="w-full text-lg font-semibold text-center h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applications" className="text-base font-medium">
                          Applications
                        </Label>
                        <Input
                          type="number"
                          id="applications"
                          value={currentProcedure.applications}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : Number.parseInt(e.target.value) || ""
                            setProcedureInstances((prev) =>
                              prev.map((p) => (p.id === currentInstanceId ? { ...p, applications: value } : p)),
                            )
                          }}
                          min="0"
                          placeholder="0"
                          className="w-full text-lg font-semibold text-center h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>

        {/* Basic Information */}
        <div className="border border-gray-200 rounded-lg">
          <Button
            type="button"
            onClick={() => setShowBasicInfo(!showBasicInfo)}
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 h-12"
          >
            <span className="font-medium text-base">Basic Information</span>
            {showBasicInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
          {showBasicInfo && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
              <SelectInput
                label="Procedure Type"
                options={procedureTypes}
                value={formData.procedureType}
                onChange={handleInputChange}
                name="procedureType"
              />

              <SelectInput
                label="Mapping System"
                options={mappingSystems}
                value={formData.mappingSystem}
                onChange={handleInputChange}
                name="mappingSystem"
              />
            </div>
          )}
        </div>

        {/* Lesion Sets */}
        <div className="border border-gray-200 rounded-lg">
          <Button
            type="button"
            onClick={() => setShowLesionSets(!showLesionSets)}
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 h-12"
          >
            <span className="font-medium text-base">Lesion Sets</span>
            {showLesionSets ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
          {showLesionSets && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <MultiSelectCheckboxes
                label="Lesion Sets"
                options={lesionSetOptions}
                selectedValues={formData.lesionSets}
                onChange={handleLesionSetsChange}
              />
            </div>
          )}
        </div>

        {/* Equipment and Catheters */}
        <div className="border border-gray-200 rounded-lg">
          <Button
            type="button"
            onClick={() => setShowEquipment(!showEquipment)}
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 h-12"
          >
            <span className="font-medium text-base">Equipment & Catheters</span>
            {showEquipment ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
          {showEquipment && (
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
              <CatheterInput
                label="Sheath 1"
                value={formData.equipment?.sheath1 || ""}
                onChange={(model) => handleEquipmentChange("sheath1", model)}
              />
              <CatheterInput
                label="Sheath 2"
                value={formData.equipment?.sheath2 || ""}
                onChange={(model) => handleEquipmentChange("sheath2", model)}
              />
              <CatheterInput
                label="Rx Catheter"
                value={formData.catheters?.rxCatheter || ""}
                onChange={(model) => handleCatheterChange("rxCatheter", model)}
              />
              <CatheterInput
                label="Mapping Catheter"
                value={formData.equipment?.mappingCatheter || ""}
                onChange={(model) => handleEquipmentChange("mappingCatheter", model)}
              />
              <CatheterInput
                label="Transseptal Puncture Tool"
                value={formData.equipment?.transseptalTool || ""}
                onChange={(model) => handleEquipmentChange("transseptalTool", model)}
              />
              <CatheterInput
                label="ICE Catheter"
                value={formData.equipment?.iceCatheter || ""}
                onChange={(model) => handleEquipmentChange("iceCatheter", model)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={handleReset}
          className="w-full bg-red-500 hover:bg-red-600 text-white h-12 text-base"
        >
          Reset Form
        </Button>
      </div>
      {showEpManagementModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal if clicking on the backdrop (not the modal content)
            if (e.target === e.currentTarget) {
              setShowEpManagementModal(false)
            }
          }}
        >
          <div className="bg-white p-4 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Manage EP Names</h2>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Default EP Names</h3>
                <div className="text-sm text-gray-500 mb-2">Default EP names can be edited or removed.</div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {Object.keys(defaultEpNames).map((name) => (
                    <div key={name} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span>{name}</span>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            const newName = prompt("Edit EP name:", name)
                            if (newName && newName.trim() && newName !== name) {
                              // Update defaultEpNames object
                              const newDefaultEPs = { ...defaultEpNames }
                              newDefaultEPs[newName.trim()] = newDefaultEPs[name]
                              delete newDefaultEPs[name]

                              // Update any preferences that reference the old name
                              if (customEPPreferences[name]) {
                                const newPreferences = { ...customEPPreferences }
                                newPreferences[newName.trim()] = newPreferences[name]
                                delete newPreferences[name]
                                setCustomEPPreferences(newPreferences)
                              }

                              // Update EP-hospital associations
                              if (epHospitalAssociations[name]) {
                                const newAssociations = { ...epHospitalAssociations }
                                newAssociations[newName.trim()] = newAssociations[name]
                                delete newAssociations[name]
                                setEpHospitalAssociations(newAssociations)
                              }

                              // Update current form if it was using the old name
                              if (formData.epName === name) {
                                setFormData((prev) => ({ ...prev, epName: newName.trim() }))
                              }

                              setToastMessage(`Renamed "${name}" to "${newName.trim()}".`)
                              setTimeout(() => setToastMessage(""), 3000)
                            }
                          }}
                          variant="ghost"
                          className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Remove ${name} from your EP list? This will also remove any saved preferences.`,
                              )
                            ) {
                              // Remove from defaultEpNames
                              const newDefaultEPs = { ...defaultEpNames }
                              delete newDefaultEPs[name]

                              // Remove any preferences for this EP
                              if (customEPPreferences[name]) {
                                const newPreferences = { ...customEPPreferences }
                                delete newPreferences[name]
                                setCustomEPPreferences(newPreferences)
                              }

                              // Remove from EP-hospital associations
                              if (epHospitalAssociations[name]) {
                                const newAssociations = { ...epHospitalAssociations }
                                delete newAssociations[name]
                                setEpHospitalAssociations(newAssociations)
                              }

                              // Clear current form if it was using this EP
                              if (formData.epName === name) {
                                setFormData((prev) => ({ ...prev, epName: "" }))
                              }

                              setToastMessage(`Removed "${name}" from EP options.`)
                              setTimeout(() => setToastMessage(""), 3000)
                            }
                          }}
                          variant="ghost"
                          className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Custom EP Names</h3>
                {Object.keys(customEPs).length === 0 ? (
                  <div className="text-sm text-gray-500">No custom EP names added yet.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {Object.keys(customEPs).map((name) => (
                      <div key={name} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span>{name}</span>
                        <Button
                          onClick={() => {
                            if (window.confirm(`Remove ${name} from your EP list?`)) {
                              const newCustomEPs = { ...customEPs }
                              delete newCustomEPs[name]
                              setCustomEPs(newCustomEPs)

                              // Also remove any preferences for this EP
                              if (customEPPreferences[name]) {
                                const newPreferences = { ...customEPPreferences }
                                delete newPreferences[name]
                                setCustomEPPreferences(newPreferences)
                              }

                              // Remove from EP-hospital associations
                              if (epHospitalAssociations[name]) {
                                const newAssociations = { ...epHospitalAssociations }
                                delete newAssociations[name]
                                setEpHospitalAssociations(newAssociations)
                              }

                              setToastMessage(`Removed "${name}" from EP options.`)
                              setTimeout(() => setToastMessage(""), 3000)
                            }
                          }}
                          variant="ghost"
                          className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={() => setShowEpManagementModal(false)} className="h-12 text-base">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

const ExportModal = ({ isOpen, onClose, data }) => {
  const [webhookUrl, setWebhookUrl] = useState("") // Removed default storage
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [showTimeEvents, setShowTimeEvents] = useState(false)
  const [showEquipment, setShowEquipment] = useState(false)
  const [showLesionSets, setShowLesionSets] = useState(false)
  const [showBasicInfo, setShowBasicInfo] = useState(false)
  const { addToOfflineQueue, offlineQueue } = useOfflineStorage()

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Removed webhook URL persistence for security

  if (!isOpen) return null

  const handleSaveToPhotos = async () => {
    try {
      const text = formatDataAsText()

      // Create canvas with better mobile optimization
      const canvas = document.createElement("canvas")

      // Set canvas size optimized for mobile viewing with Safari compatibility
      canvas.width = 800
      canvas.height = 1200

      // Safari requires explicit 2d context options
      const ctx = canvas.getContext("2d", { alpha: false })
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Set background
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties optimized for mobile
      ctx.fillStyle = "black"
      ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

      // Split text into lines and draw
      const lines = text.split("\n")
      const lineHeight = 22
      let y = 40

      lines.forEach((line) => {
        if (y > canvas.height - 40) return // Stop if we run out of space
        ctx.fillText(line, 30, y)
        y += lineHeight
      })

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          try {
            // For iOS Safari, create download link
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `AF_Ablation_Procedure_${new Date().toISOString().slice(0, 10)}.png`

            // Add attributes for iOS compatibility
            link.setAttribute("target", "_blank")
            link.setAttribute("rel", "noopener noreferrer")

            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            URL.revokeObjectURL(url)

            setExportResult({
              success: true,
              message: "Image saved! Check your Downloads or tap 'Share' to save to Photos.",
            })
            setTimeout(() => setExportResult(null), 5000)
          } catch (error) {
            console.error("Error saving image:", error)
            setExportResult({
              success: false,
              message: "Error saving image. Please try again.",
            })
            setTimeout(() => setExportResult(null), 3000)
          }
        },
        "image/png",
        0.95,
      )
    } catch (error) {
      console.error("Error creating image:", error)
      setExportResult({
        success: false,
        message: "Error creating image. Please try again.",
      })
      setTimeout(() => setExportResult(null), 3000)
    }
  }

  const formatDataAsText = () => {
    let text = "AF ABLATION PROCEDURE RECORD\n"
    text += `Date: ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}\n\n`

    // Basic info
    text += `Account: ${data.accountName || "N/A"}\n`
    text += `EP: ${data.epName || "N/A"}\n`
    text += `Procedure Type: ${data.procedureType || "N/A"}\n`
    text += `Mapping System: ${data.mappingSystem || "N/A"}\n\n`

    // Lesion Sets
    text += "LESION SETS:\n"
    if (data.lesionSets) {
      const selectedLesions = Object.entries(data.lesionSets)
        .filter(([_, selected]) => selected)
        .map(([name]) => name)

      if (selectedLesions.length > 0) {
        text += selectedLesions.join(", ") + "\n"
      } else {
        text += "None selected\n"
      }
    }
    text += "\n"

    // Time events - show all procedures
    text += "PROCEDURES:\n"
    if (data.procedureInstances && data.procedureInstances.length > 0) {
      data.procedureInstances.forEach((procedure, index) => {
        text += `\n--- ${procedure.name} ---\n`
        if (procedure.timeEvents) {
          if (procedure.timeEvents.groinAccess) text += `Groin Access: ${procedure.timeEvents.groinAccess}\n`
          if (procedure.timeEvents.transseptalPuncture)
            text += `Transseptal Puncture: ${procedure.timeEvents.transseptalPuncture}\n`
          if (procedure.timeEvents.farawaveInsertion)
            text += `FARAWAVE Insertion: ${procedure.timeEvents.farawaveInsertion}\n`
          if (procedure.timeEvents.farawaveRemoval)
            text += `FARAWAVE Removal: ${procedure.timeEvents.farawaveRemoval}\n`
          if (procedure.timeEvents.faradriveRemoval)
            text += `FARADRIVE Removal: ${procedure.timeEvents.faradriveRemoval}\n`
          if (procedure.timeEvents.groinClosure) text += `Groin Closure: ${procedure.timeEvents.groinClosure}\n`
        }
        text += `Fluoro Time: ${procedure.fluoroTime || "0"} min\n`
        text += `Applications: ${procedure.applications || "0"}\n`
      })
    } else {
      // Fallback for old format
      if (data.timeEvents) {
        if (data.timeEvents.groinAccess) text += `Groin Access: ${data.timeEvents.groinAccess}\n`
        if (data.timeEvents.transseptalPuncture)
          text += `Transseptal Puncture: ${data.timeEvents.transseptalPuncture}\n`
        if (data.timeEvents.farawaveInsertion) text += `FARAWAVE Insertion: ${data.timeEvents.farawaveInsertion}\n`
        if (data.timeEvents.farawaveRemoval) text += `FARAWAVE Removal: ${data.timeEvents.farawaveRemoval}\n`
        if (data.timeEvents.faradriveRemoval) text += `FARADRIVE Removal: ${data.timeEvents.faradriveRemoval}\n`
        if (data.timeEvents.groinClosure) text += `Groin Closure: ${data.timeEvents.groinClosure}\n`
      }
      text += `Fluoro Time: ${data.fluoroTime || "0"} min\n`
      text += `Applications: ${data.applications || "0"}\n`
    }
    text += "\n"

    // Equipment and Catheters
    text += "EQUIPMENT USED:\n"
    if (data.equipment) {
      if (data.equipment.sheath1) text += `Sheath 1: ${data.equipment.sheath1}\n`
      if (data.equipment.sheath2) text += `Sheath 2: ${data.equipment.sheath2}\n`
      if (data.equipment.mappingCatheter) text += `Mapping Catheter: ${data.equipment.mappingCatheter}\n`
      if (data.equipment.transseptalTool) text += `Transseptal Puncture Tool: ${data.equipment.transseptalTool}\n`
      if (data.equipment.iceCatheter) text += `ICE Catheter: ${data.equipment.iceCatheter}\n`
    }
    if (data.catheters) {
      if (data.catheters.rxCatheter) text += `Rx Catheter: ${data.catheters.rxCatheter}\n`
    }

    return text
  }

  const handleSaveToFiles = () => {
    try {
      const text = formatDataAsText()
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `AF_Ablation_Procedure_${new Date().toISOString().slice(0, 10)}.txt`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)

      setExportResult({
        success: true,
        message: "File downloaded successfully!",
      })
      setTimeout(() => setExportResult(null), 3000)
    } catch (error) {
      console.error("Error saving file:", error)
      setExportResult({
        success: false,
        message: "Error downloading file. Please try again.",
      })
      setTimeout(() => setExportResult(null), 3000)
    }
  }

  const handleCopyToClipboard = async () => {
    const text = formatDataAsText()

    // Check if running in an iframe
    const isInIframe = typeof window !== "undefined" && window !== window.top

    // Check if Web Share API is available and not in an iframe
    if (typeof navigator !== "undefined" && navigator.share && !isInIframe) {
      try {
        await navigator.share({
          title: "AF Ablation Procedure Data",
          text: text,
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // Fall back to clipboard copy
        copyToClipboard(text)
      }
    } else {
      // Fallback for browsers without Web Share API or when in iframe
      copyToClipboard(text)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setExportResult({
          success: true,
          message: "Text copied to clipboard! You can now paste it into your Notes app.",
        })
        setTimeout(() => setExportResult(null), 3000)
      } else {
        throw new Error("Clipboard API not available")
      }
    } catch (error) {
      console.error("Failed to copy:", error)
      alert("Could not copy to clipboard. Please use the Save to Files option instead.")
    }
  }

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
    const link = document.createElement("a")
    link.href = jsonString
    link.download = `AF_Ablation_Procedure_${new Date().toISOString().slice(0, 10)}.json`
    link.click()
  }

  const handleExportCSV = () => {
    let csv = "data:text/csv;charset=utf-8,"

    const headers = ["Field", "Value"]
    csv += headers.join(",") + "\r\n"

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          csv += `${key}.${subKey},"${subValue}"\r\n`
        }
      } else {
        csv += `${key},"${value}"\r\n`
      }
    }

    const link = document.createElement("a")
    link.href = encodeURI(csv)
    link.download = `AF_Ablation_Procedure_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  const handleExportToSalesforce = async () => {
    if (!webhookUrl) {
      alert("Please enter a Power Automate webhook URL first.")
      return
    }

    // Check if offline
    if (!navigator.onLine) {
      const salesforceData = {
        account_name: data.accountName,
        ep_name: data.epName,
        procedure_type: data.procedureType,
        mapping_system: data.mappingSystem,
        lesion_sets: Object.entries(data.lesionSets || {})
          .filter(([_, selected]) => selected)
          .map(([name]) => name)
          .join(", "),
        time_events: {
          groin_access: data.timeEvents?.groinAccess || "",
          transseptal_puncture: data.timeEvents?.transseptalPuncture || "",
          farawave_insertion: data.timeEvents?.farawaveInsertion || "",
          farawave_removal: data.timeEvents?.farawaveRemoval || "",
          faradrive_removal: data.timeEvents?.faradriveRemoval || "",
          groin_closure: data.timeEvents?.groinClosure || "",
        },
        fluoro_time: data.fluoroTime || 0,
        applications: data.applications || 0,
        equipment: {
          sheath_1: data.equipment?.sheath1 || "",
          sheath_2: data.equipment?.sheath2 || "",
          mapping_catheter: data.equipment?.mappingCatheter || "",
          transseptal_tool: data.equipment?.transseptalTool || "",
          ice_catheter: data.equipment?.iceCatheter || "",
          rx_catheter: data.catheters?.rxCatheter || "",
        },
      }

      addToOfflineQueue("salesforce_export", {
        webhookUrl,
        payload: salesforceData,
      })

      setExportResult({
        success: true,
        message: "You're offline. Data queued for export when connection is restored.",
      })
      return
    }

    // Rest of the existing online export logic...
    setIsExporting(true)
    setExportResult(null)

    try {
      const salesforceData = {
        account_name: data.accountName,
        ep_name: data.epName,
        procedure_type: data.procedureType,
        mapping_system: data.mappingSystem,
        lesion_sets: Object.entries(data.lesionSets || {})
          .filter(([_, selected]) => selected)
          .map(([name]) => name)
          .join(", "),
        time_events: {
          groin_access: data.timeEvents?.groinAccess || "",
          transseptal_puncture: data.timeEvents?.transseptalPuncture || "",
          farawave_insertion: data.timeEvents?.farawaveInsertion || "",
          farawave_removal: data.timeEvents?.farawaveRemoval || "",
          faradrive_removal: data.timeEvents?.faradriveRemoval || "",
          groin_closure: data.timeEvents?.groinClosure || "",
        },
        fluoro_time: data.fluoroTime || 0,
        applications: data.applications || 0,
        equipment: {
          sheath_1: data.equipment?.sheath1 || "",
          sheath_2: data.equipment?.sheath2 || "",
          mapping_catheter: data.equipment?.mappingCatheter || "",
          transseptal_tool: data.equipment?.transseptalTool || "",
          ice_catheter: data.equipment?.iceCatheter || "",
          rx_catheter: data.catheters?.rxCatheter || "",
        },
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salesforceData),
      })

      if (response.ok) {
        setExportResult({
          success: true,
          message: "Data successfully sent to Salesforce!",
        })
      } else {
        const errorText = await response.text()
        throw new Error(`Failed to send data: ${errorText}`)
      }
    } catch (error) {
      console.error("Error exporting to Salesforce:", error)
      setExportResult({
        success: false,
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal if clicking on the backdrop (not the modal content)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white p-4 rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Save Procedure Data</h2>

        <div className="space-y-6">
          {/* Procedure Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Procedures</h3>
            {data.procedureInstances && data.procedureInstances.length > 0 ? (
              <>
                {data.procedureInstances.map((procedure, index) => (
                  <div key={index} className="mb-4 border-b pb-2 last:border-b-0 last:pb-0">
                    <div className="font-semibold">{procedure.name}</div>
                    <div className="text-sm space-y-1">
                      {procedure.timeEvents?.groinAccess && <div>Groin Access: {procedure.timeEvents.groinAccess}</div>}
                      {procedure.timeEvents?.transseptalPuncture && (
                        <div>Transseptal Puncture: {procedure.timeEvents.transseptalPuncture}</div>
                      )}
                      {procedure.timeEvents?.farawaveInsertion && (
                        <div>FARAWAVE Insertion: {procedure.timeEvents.farawaveInsertion}</div>
                      )}
                      {procedure.timeEvents?.farawaveRemoval && (
                        <div>FARAWAVE Removal: {procedure.timeEvents.farawaveRemoval}</div>
                      )}
                      {procedure.timeEvents?.faradriveRemoval && (
                        <div>FARADRIVE Removal: {procedure.timeEvents.faradriveRemoval}</div>
                      )}
                      {procedure.timeEvents?.groinClosure && (
                        <div>Groin Closure: {procedure.timeEvents.groinClosure}</div>
                      )}
                      <div className="font-medium mt-1">
                        Fluoro: {procedure.fluoroTime || "0"} min | Applications: {procedure.applications || "0"}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Fallback for old format
              <>
                {data.timeEvents?.groinAccess && (
                  <div className="text-sm">Groin Access: {data.timeEvents.groinAccess}</div>
                )}
                {data.timeEvents?.transseptalPuncture && (
                  <div className="text-sm">Transseptal Puncture: {data.timeEvents.transseptalPuncture}</div>
                )}
                {data.timeEvents?.farawaveInsertion && (
                  <div className="text-sm">FARAWAVE Insertion: {data.timeEvents.farawaveInsertion}</div>
                )}
                {data.timeEvents?.farawaveRemoval && (
                  <div className="text-sm">FARAWAVE Removal: {data.timeEvents.farawaveRemoval}</div>
                )}
                {data.timeEvents?.faradriveRemoval && (
                  <div className="text-sm">FARADRIVE Removal: {data.timeEvents.faradriveRemoval}</div>
                )}
                {data.timeEvents?.groinClosure && (
                  <div className="text-sm">Groin Closure: {data.timeEvents.groinClosure}</div>
                )}
                {!data.timeEvents ||
                  (Object.keys(data.timeEvents).length === 0 && (
                    <div className="text-sm text-gray-500">No times recorded</div>
                  ))}
              </>
            )}
          </div>

          {/* Basic Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Basic Information</h3>
            <div className="text-sm space-y-1">
              <div>Account: {data.accountName || "N/A"}</div>
              <div>EP: {data.epName || "N/A"}</div>
              <div>Procedure Type: {data.procedureType || "N/A"}</div>
              <div>Mapping System: {data.mappingSystem || "N/A"}</div>
            </div>
          </div>

          {/* Lesion Sets */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Lesion Sets</h3>
            <div className="text-sm">
              {data.lesionSets
                ? Object.entries(data.lesionSets)
                    .filter(([_, selected]) => selected)
                    .map(([name]) => name)
                    .join(", ") || "None selected"
                : "None selected"}
            </div>
          </div>

          {/* Equipment */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Equipment Used</h3>
            <div className="text-sm space-y-1">
              {data.equipment?.sheath1 && <div>Sheath 1: {data.equipment.sheath1}</div>}
              {data.equipment?.sheath2 && <div>Sheath 2: {data.equipment.sheath2}</div>}
              {data.equipment?.mappingCatheter && <div>Mapping Catheter: {data.equipment.mappingCatheter}</div>}
              {data.equipment?.transseptalTool && <div>Transseptal Tool: {data.equipment.transseptalTool}</div>}
              {data.equipment?.iceCatheter && <div>ICE Catheter: {data.equipment.iceCatheter}</div>}
              {data.catheters?.rxCatheter && <div>Rx Catheter: {data.catheters.rxCatheter}</div>}
              {(!data.equipment || Object.keys(data.equipment).length === 0) &&
                (!data.catheters || Object.keys(data.catheters).length === 0) && (
                  <div className="text-gray-500">No equipment recorded</div>
                )}
            </div>
          </div>

          {/* Primary Actions - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button onClick={handleSaveToFiles} className="h-12 text-base">
              Save to Files
            </Button>
            <Button onClick={handleSaveToPhotos} className="h-12 text-base">
              Save to Photos
            </Button>
            <Button onClick={handleCopyToClipboard} className="h-12 text-base">
              Copy / Share
            </Button>
          </div>

          {/* Advanced Options Toggle */}
          <Button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            variant="outline"
            className="w-full flex items-center justify-between h-12 text-base"
          >
            <span>Advanced Export Options</span>
            {showAdvancedOptions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>

          {showAdvancedOptions && (
            <div className="space-y-4">
              {/* File Format Options */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Export Formats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleExportJSON} variant="outline" className="h-12 text-base">
                    Export as JSON
                  </Button>
                  <Button onClick={handleExportCSV} variant="outline" className="h-12 text-base">
                    Export as CSV
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Salesforce Integration</h3>
                <div className="text-sm text-gray-600 mb-3">
                  Coming Soon... Salesforce integration is currently under development and will be available in a future
                  update.
                </div>
                <div className="space-y-3">
                  <Label htmlFor="webhookUrl" className="text-base">
                    Power Automate Webhook URL
                  </Label>
                  <Input
                    id="webhookUrl"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="Feature coming soon..."
                    disabled
                    className="h-12"
                  />
                  <Button onClick={handleExportToSalesforce} disabled={true} className="w-full h-12 text-base">
                    Export to Salesforce (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          )}

          {exportResult && (
            <div
              className={`p-3 rounded-md ${
                exportResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {exportResult.message}
            </div>
          )}

          {offlineQueue.length > 0 && (
            <div className="p-3 rounded-md bg-blue-100 text-blue-800">
              {offlineQueue.length} item(s) queued for export when online
            </div>
          )}

          <Button onClick={onClose} className="w-full h-12 text-base">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AFAblationRecorder() {
  const [showExportModal, setShowExportModal] = useState(false)
  const [procedureData, setProcedureData] = useState({})

  const handleExport = (data) => {
    setProcedureData(data)
    setShowExportModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">AF Ablation Procedure Recorder</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ProcedureForm onExport={handleExport} />
        </div>
      </div>
      {showExportModal && (
        <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} data={procedureData} />
      )}
    </div>
  )
}
