
import { useTheme } from "@/context/ThemeContext"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      expand={true}
      closeButton={true}
      richColors={true}
      toastOptions={{
        duration: 5000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          title: "group-[.toast]:text-foreground group-[.toast]:font-medium",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "!bg-green-50 !border-l-green-500 !border-l-4 dark:!bg-green-900/30 dark:!border-l-green-400",
          error: "!bg-red-50 !border-l-red-500 !border-l-4 dark:!bg-red-900/30 dark:!border-l-red-400",
          warning: "!bg-amber-50 !border-l-amber-500 !border-l-4 dark:!bg-amber-900/30 dark:!border-l-amber-400",
          info: "!bg-blue-50 !border-l-blue-500 !border-l-4 dark:!bg-blue-900/30 dark:!border-l-blue-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
