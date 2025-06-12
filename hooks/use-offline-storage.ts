"use client"

import { useState, useEffect } from "react"

interface OfflineQueueItem {
  id: string
  type: "salesforce_export"
  data: any
  timestamp: number
  retryCount: number
}

export function useOfflineStorage() {
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)

  // Load offline queue from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("af_ablation_offline_queue")
      if (saved) {
        setOfflineQueue(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading offline queue:", error)
    }
  }, [])

  // Save offline queue to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("af_ablation_offline_queue", JSON.stringify(offlineQueue))
    } catch (error) {
      console.error("Error saving offline queue:", error)
    }
  }, [offlineQueue])

  // Process queue when back online
  useEffect(() => {
    const processQueue = async () => {
      if (!navigator.onLine || offlineQueue.length === 0 || isProcessingQueue) {
        return
      }

      setIsProcessingQueue(true)

      for (const item of offlineQueue) {
        try {
          if (item.type === "salesforce_export") {
            // Attempt to send the data
            const response = await fetch(item.data.webhookUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(item.data.payload),
            })

            if (response.ok) {
              // Remove successful item from queue
              setOfflineQueue((prev) => prev.filter((queueItem) => queueItem.id !== item.id))
            } else {
              // Increment retry count
              setOfflineQueue((prev) =>
                prev.map((queueItem) =>
                  queueItem.id === item.id ? { ...queueItem, retryCount: queueItem.retryCount + 1 } : queueItem,
                ),
              )
            }
          }
        } catch (error) {
          console.error("Error processing queue item:", error)
          // Increment retry count on error
          setOfflineQueue((prev) =>
            prev.map((queueItem) =>
              queueItem.id === item.id ? { ...queueItem, retryCount: queueItem.retryCount + 1 } : queueItem,
            ),
          )
        }
      }

      // Remove items that have failed too many times
      setOfflineQueue((prev) => prev.filter((item) => item.retryCount < 3))
      setIsProcessingQueue(false)
    }

    // Process queue when coming back online
    const handleOnline = () => {
      setTimeout(processQueue, 1000) // Small delay to ensure connection is stable
    }

    window.addEventListener("online", handleOnline)

    // Also try to process queue on mount if online
    if (navigator.onLine) {
      processQueue()
    }

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [offlineQueue, isProcessingQueue])

  const addToOfflineQueue = (type: string, data: any) => {
    const item: OfflineQueueItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: type as any,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    }

    setOfflineQueue((prev) => [...prev, item])
  }

  const clearOfflineQueue = () => {
    setOfflineQueue([])
  }

  return {
    offlineQueue,
    addToOfflineQueue,
    clearOfflineQueue,
    isProcessingQueue,
  }
}
