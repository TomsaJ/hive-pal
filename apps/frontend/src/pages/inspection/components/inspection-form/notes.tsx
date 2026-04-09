import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { InspectionFormData } from './schema';
import { AiBadge } from './ai-badge';

type NotesSectionProps = {
  isAiSuggested?: (field: keyof InspectionFormData) => boolean;
};

export function NotesSection({ isAiSuggested }: NotesSectionProps) {
  const { t } = useTranslation('inspection');
  const form = useFormContext<InspectionFormData>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">
        {t('inspection:form.notes.title')}
      </h2>
      <p className="text-sm text-muted-foreground">
        {t('inspection:form.notes.description')}
      </p>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Notes
              {isAiSuggested?.('notes') && <AiBadge />}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('inspection:form.notes.placeholder')}
                className="min-h-[120px]"
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}