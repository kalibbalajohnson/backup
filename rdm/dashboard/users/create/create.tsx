'use client';
import ModuleHeader from '@/components/module-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { usePharmacistsContext } from '@/lib/providers/pharmacists.context';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ROLES } from '@/lib/utils';
import { useNursesContext } from '@/lib/providers/nurses.context';
import { useDoctorsContext } from '@/lib/providers/doctors.context';
import { useUsersContext } from '@/lib/providers/users.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function CreateUserForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { AddPharmacistHandler } = usePharmacistsContext();
  const { AddNurseHandler } = useNursesContext();
  const { AddDoctorHandler } = useDoctorsContext();
  const { AddUserHandler } = useUsersContext();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const [user, setUser] = useLocalStorage('user', {});
  const { toast } = useToast();

  const [selectedOption, setSelectedOption] = useState(null);

  async function onSubmit(values) {
    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
        .then(async (userCredential) => {
          const newUser = userCredential.user;

          try {
            values.uid = newUser?.uid;
            delete values.password;

            switch (values.role) {
              case 'nurse':
                await AddUserHandler(values);
                // await AddNurseHandler(values);
                router.push('/dashboard/nurses');
                break;
              case 'pharmacist':
                // await AddPharmacistHandler(values);
                await AddUserHandler(values);
                router.push('/dashboard/pharmacists');
                break;

              case 'doctor':
                // await AddDoctorHandler(values);
                await AddUserHandler(values);
                router.push('/dashboard/doctors');
                break;

              default:
                await AddUserHandler(values);
                router.push('/dashboard');

                break;
            }
          } catch (error) {
            toast({
              variant: 'destructive',
              title: `Failed to create ${values.role}.`
            });
          }
          toast({
            title: `Successfully created ${values.role}.`
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast({
            variant: 'destructive',
            title: `Failed to create ${values.role}.`
          });
        });

      setIsLoading(false);
      toast({
        title: `Successfully created ${values.role}.`
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: `Failed to create ${values.role}.`
      });
    }
  }
  return (
    <div className="space-y-12">
      <ModuleHeader heading={`Add ${role ? `${role}` : `user`}`} />
      <Card className="bg-white px-3 py-8">
        <CardContent>
          <Formik
            enableReinitialize
            // validationSchema={PHARMACISTS_SCHEMA}
            initialValues={{
              firstName: '',
              lastName: '',
              license: '',
              email: '',
              password: '',
              phoneNumber: '',
              areaOfSpecialization: '',
              pharmaceutical: user?.uid,
              role: role
            }}
            onSubmit={onSubmit}
          >
            {}
            {({ values, setFieldValue }) => (
              <Form className="bg-white p-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 ">
                  <div className="w-full">
                    <Label>Role</Label>
                    <Select
                      onValueChange={(e) => setFieldValue('role', e)}
                      defaultValue={role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          {ROLES?.map((role, idex) => {
                            return (
                              <SelectItem value={role.value} key={idex}>
                                {role?.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      placeholder="Enter First Name"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      placeholder="Enter Last Name"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      name="password"
                      placeholder="Enter Password"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>{' '}
                  <div>
                    <Label>License Number</Label>
                    <Input
                      name="license"
                      placeholder="Enter License Number"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Input
                      name="email"
                      placeholder="Enter Email Address"
                      width="w-full"
                      disabled={isLoading}
                      type="email"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      name="phoneNumber"
                      placeholder="Enter Phone Number"
                      width="w-full"
                      disabled={isLoading}
                      type="tel"
                    />
                  </div>
                  <div>
                    <Label>Area of Specialization</Label>
                    <Input
                      name="areaOfSpecialization"
                      placeholder="Enter Area of Specialization"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 py-5">
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="text-white"
                  >
                    {isLoading ? (
                      <span className="flex flex-row items-center">
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Loading..
                      </span>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
