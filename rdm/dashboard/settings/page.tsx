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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { postRequest } from '@/lib/requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import useMyMemberships from '@/hooks/use-memberships';
import useRoles from '@/hooks/use-roles';
import usePermissions from '@/hooks/use-permissions';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from '@/components/ui/select';
import { MembershipsClient } from '@/components/memberships/client';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { hasPermission } from '@/lib/utils';
import { Input } from '@/components/ui/v2/input';
import { Checkbox } from '@/components/ui/checkbox';

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
  organization: z.string().min(1, 'Organization ID is required'),
  role: z.string().min(1, 'Role ID is required'),
  branch: z.string().optional()
});

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  organization: z.string().min(1, 'Organization ID is required'),
  permissions: z
    .array(z.string())
    .nonempty('At least one permission is required')
});

type InviteFormInputs = z.infer<typeof inviteSchema>;
type RoleFormInputs = z.infer<typeof roleSchema>;

export default function InviteMemberPage() {
  const { data: session } = useSession();
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { data: roles, isPending: isPendingRoles } = useRoles();
  const { data: permissions, isPending: isPendingPermissions } =
    usePermissions();
  const { data: myMemberships, isPending: isPendingMyMemberships } =
    useMyMemberships({ email: session?.user?.email });
  const form = useForm<InviteFormInputs>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      emails: [''],
      organization: '',
      role: ''
    }
  });
  const roleForm = useForm<RoleFormInputs>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      permissions: []
    }
  });
  const queryClient = useQueryClient();

  const [activeMembership, setActiveMembership] = useLocalStorage(
    'membership',
    {}
  );

  const inviteMember = useMutation({
    mutationFn: async (values: InviteFormInputs) => {
      const data = await postRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/organisations/memberships/invite/`,
        {
          ...values,
          frontend_url: `${new URL(window.location.href).origin}/orgs`
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

  const createRole = useMutation({
    mutationFn: async (values: RoleFormInputs) => {
      const data = await postRequest(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/roles/`,
        values,
        session?.tokens?.access
      );
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsRoleModalOpen(false);
      toast({
        title: 'Success',
        description: 'Role created successfully.'
      });
    },
    onError(error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create role.'
      });
    }
  });

  const onSubmit = useCallback(
    (data: InviteFormInputs) => {
      inviteMember.mutate(data);
    },
    [inviteMember]
  );

  const onSubmitRole = useCallback(
    (data: RoleFormInputs) => {
      createRole.mutate(data);
    },
    [createRole]
  );

  const { isPending } = inviteMember;
  const { isPending: isPendingRoleCreation } = createRole;

  const hasAccess = hasPermission(activeMembership?.role?.permissions, [
    'add',
    'invite'
  ]);

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Memberships (${myMemberships?.length ?? 0})`} />

          {hasAccess && (
            <div className="space-x-4">
              <Dialog
                open={isInvitationModalOpen}
                onOpenChange={setIsInvitationModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="text-xs md:text-sm">
                    <Plus className="mr-2 h-4 w-4" /> Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                      Fill out the form to invite a member to your organization.
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
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="organization">
                              Organization
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Organizations</SelectLabel>
                                    {myMemberships?.map((membership) => (
                                      <SelectItem
                                        key={membership.organization_id}
                                        value={membership.organization_id}
                                      >
                                        {membership.organization}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="role">Role</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles?.map((role) => (
                                      <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
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
              <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
                <DialogTrigger asChild>
                  <Button className="text-xs md:text-sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Create Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                      Create a new role that will be assigned to new members.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...roleForm}>
                    <form
                      className="grid gap-4 py-4"
                      onSubmit={roleForm.handleSubmit(onSubmitRole)}
                    >
                      <FormField
                        control={roleForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="name">Role Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter role name"
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={roleForm.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="organization">
                              Organization
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Organizations</SelectLabel>
                                    {myMemberships?.map((membership) => (
                                      <SelectItem
                                        key={membership.organization_id}
                                        value={membership.organization_id}
                                      >
                                        {membership.organization}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roleForm.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">
                                Permissions
                              </FormLabel>
                              <FormDescription>
                                Select the permissions you want to assign.
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {isPendingRoles ? (
                                <span className="text-sm">
                                  Loading Permissions...
                                </span>
                              ) : (
                                permissions?.map((permission) => (
                                  <FormItem
                                    key={permission.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          permission.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                permission.id
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== permission.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {permission.name}
                                    </FormLabel>
                                  </FormItem>
                                ))
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={isPendingRoleCreation}>
                          {isPendingRoleCreation ? 'Creating...' : 'Submit'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <MembershipsClient
          data={myMemberships ?? []}
          isLoading={isPendingMyMemberships}
        />
      </div>
    </div>
  );
}
