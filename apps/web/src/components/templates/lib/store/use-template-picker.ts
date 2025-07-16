import { create } from 'zustand';

interface TemplatePickerStore {
	templateId: string | null;
	selectTemplate: (templateId: string) => void;
}

export const useTemplatePicker = create<TemplatePickerStore>((set) => ({
	templateId: null,
	selectTemplate: (templateId) => {
		set({ templateId });
	},
}));
