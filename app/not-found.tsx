import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Event niet gevonden</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Dit event bestaat niet of is verwijderd. Controleer de link en probeer het opnieuw.
        </p>

        <Link href="/">
          <Button className="bg-primary hover:bg-primary-hover text-white">Terug naar home</Button>
        </Link>
      </div>
    </div>
  )
}
