'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, SubmitErrorHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/v2/input';
import Breadcrumbs from './breadcrumbs';
import { postRequest } from '@/lib/requests';
import { useToast } from '@/hooks/use-toast';
import { useActiveMembership } from '@/hooks/use-memberships';
import { useRouter } from 'next/navigation';
import { Routes } from '@/lib/config/routes';

const regulationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(
    z.object({
      title: z.string().min(1, 'Requirement is required')
    })
  )
});

type RegulationSchema = z.infer<typeof regulationSchema>;

export default function CreateRegulationFromManualInputForm({}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { activeMembership, accessToken } = useActiveMembership();
  const router = useRouter();

  const form = useForm<RegulationSchema>({
    resolver: zodResolver(regulationSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: [{ title: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'requirements'
  });

  const mutation = useMutation({
    mutationFn: async (values: RegulationSchema) => {
      console.log({
        ...values,
        organization: activeMembership?.organization_id
      });
      const data = await postRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulations/create-from-manual-input/`,
        {
          ...values,
          organization: activeMembership?.organization_id
        },
        accessToken
      );
    },
    onSuccess: () => {
      form.reset();
      router.push(Routes.regulations.list);
      queryClient.invalidateQueries({ queryKey: ['organizationRegulations'] });
      toast({
        title: 'Success',
        description: 'Regulation created successfully.'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create regulation.'
      });
      console.error('Error submitting the form:', error);
    }
  });

  const onSubmit = async (values: RegulationSchema) => {
    mutation.mutate(values);
  };

  const onFormError: SubmitErrorHandler<RegulationSchema> = (errors) => {
    console.log(errors);
  };

  const { isPending } = mutation;

  return (
    <div className="flex flex-col space-y-8">
      <Breadcrumbs />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onFormError)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name={`title`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={`title`}>Regulation Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} disabled={isPending} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`description`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor={`description`}>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id}>
                <FormField
                  control={form.control}
                  name={`requirements.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor={`requirements.${index}.requirement`}>
                        Requirement {index + 1}
                      </FormLabel>
                      <div className="flex  items-center space-x-4">
                        <FormControl>
                          <Input
                            placeholder="Requirement"
                            {...field}
                            disabled={isPending}
                          />
                        </FormControl>
                        {index > 0 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            type="button"
                          >
                            X
                          </Button>
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex  items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => append({ title: '' })}
              type="button"
            >
              Add Requirement
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
