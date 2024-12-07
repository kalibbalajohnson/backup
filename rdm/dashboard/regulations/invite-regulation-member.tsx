'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { postRequest } from '@/lib/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useRegulationsContext } from '@/lib/providers/regulations.context';

const inviteSchema = z.object({
  emails: z
    .string()
    .nonempty('At least one email is required')
    .transform(
      (emails) => emails.split(',').map((email) => email.trim()) // Split by comma and trim spaces
    )
    .refine(
      (emails) =>
        emails.every((email) => z.string().email().safeParse(email).success),
      {
        message: 'One or more emails are invalid'
      }
    ),
  regulation: z.string().min(1, 'Regulation is required'),
  branch: z.string().optional()
});

type InviteFormInputs = z.infer<typeof inviteSchema>;

export default function InviteRegulationMember({
  organization,
  regulations
}: {
  organization: string;
  regulations: any;
}) {
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const form = useForm<InviteFormInputs>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      emails: [''],
      regulation: ''
    }
  });

  const inviteMember = useMutation({
    mutationFn: async (values: InviteFormInputs) => {
      const data = await postRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulations/memberships/invite/`,
        {
          ...values,
          organization
        },
        session?.tokens?.access
      );
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['myMemberships'] });
      setIsInvitationModalOpen(false);
      toast({
        title: 'Success',
        description: 'Invitation sent successfully.'
      });
    },
    onError(error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation.'
      });
    }
  });

  const onSubmit = useCallback(
    (data: InviteFormInputs) => {
      inviteMember.mutate(data);
    },
    [inviteMember]
  );

  const { isPending } = inviteMember;
  console.log(regulations);
  return (
    <Dialog
      open={isInvitationModalOpen}
      onOpenChange={setIsInvitationModalOpen}
    >
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Fill out the form to invite a member to your regulation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="emails">Emails</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter comma-separated emails"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regulation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a regulation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regulations?.map((regulation) => (
                        <SelectItem key={regulation.id} value={regulation.id}>
                          {regulation.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
