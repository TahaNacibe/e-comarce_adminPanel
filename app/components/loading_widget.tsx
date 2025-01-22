import { LoaderCircle } from "lucide-react";




export default function LoadingWidget() { 
    return (
        <div className='flex items-center justify-center'>
        <LoaderCircle className='animate-spin' />
      </div>
    );
}