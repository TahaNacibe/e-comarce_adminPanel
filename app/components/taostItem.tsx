import { toast } from "@/hooks/use-toast"

export default function ToastItem({ title, desc }: { title: string, desc?: string }){
    return (
        toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
    )
}