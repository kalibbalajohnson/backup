'use client';
import ModuleHeader from '@/components/module-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useMoleculesContext } from '@/lib/providers/drugs.context';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function CreateDrugsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();
  const { AddMoleculeHandler } = useMoleculesContext();
  const [user, setUser] = useLocalStorage('user', {});
  const { toast } = useToast();

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      const res = await AddMoleculeHandler({
        ...values
      });

      setIsLoading(false);
      toast({
        title: 'Successfully created drug.'
      });
      router.push('/dashboard/drugs');
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Failed to create drug.'
      });
    }
  }
  return (
    <div className="space-y-12">
      <ModuleHeader heading="Add Drug" />
      <Card className="bg-white px-3 py-8">
        <CardContent>
          <Formik
            enableReinitialize
            // validationSchema={DRUGS_SCHEMA}
            initialValues={{
              brandName: '',
              genericName: '',
              safetyInformation: '',
              dosage: '',
              modeOfAdministration: '',
              manufacturer: '',
              pharmaceutical: user?.uid
            }}
            onSubmit={onSubmit}
          >
            {}
            {({ values, setFieldValue }) => (
              <Form className="bg-white p-6" encType="multipart/form-data">
                <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 ">
                  <div>
                    <Label>Brand Name</Label>
                    <Input
                      name="brandName"
                      placeholder="Enter Brand Name"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Generic Name</Label>
                    <Input
                      name="genericName"
                      placeholder="Enter Generic Name"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>{' '}
                  <div>
                    <Label>Safety Information</Label>
                    <Input
                      name="safetyInformation"
                      placeholder="Enter Safety Information"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      name="dosage"
                      placeholder="Enter Dosage"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Mode Of Administration</Label>
                    <Input
                      name="modeOfAdministration"
                      placeholder="Enter Mode Of Administration"
                      width="w-full"
                      disabled={isLoading}
                      type="text"
                    />
                  </div>
                  <div>
                    <Label>Manufacturer</Label>
                    <Input
                      name="manufacturer"
                      placeholder="Enter Manufacturer"
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
