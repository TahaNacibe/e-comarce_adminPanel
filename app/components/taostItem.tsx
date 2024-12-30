import { toast } from "@/hooks/use-toast"

export default function ToastItem({ title, desc }: { title: string, desc?: string }){
    return (
        toast({
            title: title,
            description: desc,
          })
    )
}