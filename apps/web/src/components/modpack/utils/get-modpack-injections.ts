import { modpackUi } from '@workspace/ui/lib/modpack';
import * as DateFNS from 'date-fns';
import * as LucideReact from 'lucide-react';
import * as Motion from 'motion';
import * as MotionReact from 'motion/react';
import * as MotionReactClient from 'motion/react-client';
import * as MotionReactM from 'motion/react-m';
import * as MotionReactMini from 'motion/react-mini';
import * as RadixUI from 'radix-ui';
import * as React from 'react';
import * as DevJSXRuntime from 'react/jsx-dev-runtime';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

export function getModpackInjections() {
	const injectModules = {
		react: React,
		motion: Motion,
		'react-dom': ReactDOM,
		'motion/react': MotionReact,
		'motion/react-client': MotionReactClient,
		'motion/react-m': MotionReactM,
		'motion/react-mini': MotionReactMini,
		'react/jsx-dev-runtime': DevJSXRuntime,
		'react/jsx-runtime': ReactJSXRuntime,
		'react-dom/client': ReactDOMClient,
		'radix-ui': RadixUI,
		'@radix-ui/react-accessible-icon': RadixUI.AccessibleIcon,
		'@radix-ui/react-accordion': RadixUI.Accordion,
		'@radix-ui/react-alert-dialog': RadixUI.AlertDialog,
		'@radix-ui/react-aspect-ratio': RadixUI.AspectRatio,
		'@radix-ui/react-avatar': RadixUI.Avatar,
		'@radix-ui/react-checkbox': RadixUI.Checkbox,
		'@radix-ui/react-collapsible': RadixUI.Collapsible,
		'@radix-ui/react-context-menu': RadixUI.ContextMenu,
		'@radix-ui/react-dialog': RadixUI.Dialog,
		'@radix-ui/react-direction': RadixUI.Direction,
		'@radix-ui/react-dropdown-menu': RadixUI.DropdownMenu,
		'@radix-ui/react-form': RadixUI.Form,
		'@radix-ui/react-hover-card': RadixUI.HoverCard,
		'@radix-ui/react-label': RadixUI.Label,
		'@radix-ui/react-menubar': RadixUI.Menubar,
		'@radix-ui/react-navigation-menu': RadixUI.NavigationMenu,
		'@radix-ui/react-one-time-password-field':
			RadixUI.unstable_OneTimePasswordField,
		'@radix-ui/react-password-toggle-field':
			RadixUI.unstable_PasswordToggleField,
		'@radix-ui/react-popover': RadixUI.Popover,
		'@radix-ui/react-portal': RadixUI.Portal,
		'@radix-ui/react-progress': RadixUI.Progress,
		'@radix-ui/react-radio-group': RadixUI.RadioGroup,
		'@radix-ui/react-scroll-area': RadixUI.ScrollArea,
		'@radix-ui/react-select': RadixUI.Select,
		'@radix-ui/react-separator': RadixUI.Separator,
		'@radix-ui/react-slider': RadixUI.Slider,
		'@radix-ui/react-slot': RadixUI.Slot,
		'@radix-ui/react-switch': RadixUI.Switch,
		'@radix-ui/react-tabs': RadixUI.Tabs,
		'@radix-ui/react-toast': RadixUI.Toast,
		'@radix-ui/react-toggle': RadixUI.Toggle,
		'@radix-ui/react-toggle-group': RadixUI.ToggleGroup,
		'@radix-ui/react-toolbar': RadixUI.Toolbar,
		'@radix-ui/react-tooltip': RadixUI.Tooltip,
		'@radix-ui/react-visually-hidden': RadixUI.VisuallyHidden,
		'date-fns': DateFNS,
		'lucide-react': LucideReact,
		...modpackUi,
	};

	return injectModules;
}
