
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// TalentLMS inspired colors
				talentlms: {
					blue: '#1976D2',
					lightBlue: '#e5f0ff',
					darkBlue: '#0D47A1',
					navBlue: '#2196F3',
					orange: '#FF7043',
					lightOrange: '#FFE0B2',
					gray: '#F5F5F7',
					lightGray: '#FAFAFA',
					darkGray: '#E0E0E3',
					text: '#333333',
					success: '#4CAF50',
					warning: '#FFC107',
					error: '#F44336',
					inactive: '#9E9E9E',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				// Enhanced fade animations
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
					"100%": { opacity: "1", transform: "translateY(0) scale(1)" }
				},
				"fade-out": {
					"0%": { opacity: "1", transform: "translateY(0) scale(1)" },
					"100%": { opacity: "0", transform: "translateY(-10px) scale(0.98)" }
				},
				// Slide animations
				"slide-in-up": {
					"0%": { transform: "translateY(100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
				"slide-in-down": {
					"0%": { transform: "translateY(-100%)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
				"slide-in-left": {
					"0%": { transform: "translateX(-100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" }
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" }
				},
				// Scale animations
				"scale-in": {
					"0%": { transform: "scale(0.8)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" }
				},
				"scale-out": {
					"0%": { transform: "scale(1)", opacity: "1" },
					"100%": { transform: "scale(0.8)", opacity: "0" }
				},
				// Sophisticated animations
				"gentle-bounce": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-4px)" }
				},
				"pulse-gentle": {
					"0%, 100%": { opacity: "1", transform: "scale(1)" },
					"50%": { opacity: "0.9", transform: "scale(1.02)" }
				},
				"shimmer": {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" }
				},
				"glow": {
					"0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.2)" },
					"50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"float-particles": {
					"0%": { transform: "translateX(-100px)" },
					"100%": { transform: "translateX(calc(100vw + 100px))" }
				},
				// Smooth rotate
				"rotate-smooth": {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" }
				},
				// Modern elastic
				"elastic": {
					"0%": { transform: "scale(1)" },
					"25%": { transform: "scale(1.05)" },
					"50%": { transform: "scale(0.98)" },
					"75%": { transform: "scale(1.02)" },
					"100%": { transform: "scale(1)" }
				},
				// Stagger animations
				"stagger-fade": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				"accordion-up": "accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				"fade-in": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
				"fade-out": "fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				"slide-in-up": "slide-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
				"slide-in-down": "slide-in-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
				"slide-in-left": "slide-in-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
				"slide-in-right": "slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
				"scale-in": "scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				"scale-out": "scale-out 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
				"gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
				"pulse-gentle": "pulse-gentle 3s ease-in-out infinite",
				"shimmer": "shimmer 2s linear infinite",
				"glow": "glow 2s ease-in-out infinite",
				"float": "float 6s ease-in-out infinite",
				"float-particles": "float-particles 20s linear infinite",
				"rotate-smooth": "rotate-smooth 2s linear infinite",
				"elastic": "elastic 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
				"stagger-fade": "stagger-fade 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
				// Delay variations
				"fade-in-delay-100": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both",
				"fade-in-delay-200": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both",
				"fade-in-delay-300": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both",
				"fade-in-delay-500": "fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both",
				"scale-in-delay-100": "scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both",
				"scale-in-delay-200": "scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both",
			},
			boxShadow: {
				'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
				'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
				'elevated': '0 20px 40px rgba(0, 0, 0, 0.1)',
				'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
				'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
				'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
				'premium': '0 10px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-premium': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
				'mesh-gradient': 'radial-gradient(at 40% 20%, rgb(120, 119, 198) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(255, 119, 198) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(120, 219, 255) 0px, transparent 50%)',
			},
			backdropFilter: {
				'glass': 'blur(16px) saturate(180%)',
				'glass-strong': 'blur(24px) saturate(200%)',
			},
			transitionDuration: {
				'2000': '2000ms',
				'3000': '3000ms',
			},
			transitionTimingFunction: {
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
