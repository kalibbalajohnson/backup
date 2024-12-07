'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPrimitive
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/v2/input';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRegulationsContext } from '@/lib/providers/regulations.context';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuid } from 'uuid';
import { LayoutDashboard, Plus, PlusIcon } from 'lucide-react';
import { Folder } from '@/types';
import DossierService from '@/services/dossiers';
import { useLocalStorage } from '@/hooks/use-local-storage';
const currentTime = new Date();

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required')
});

type FormInputs = z.infer<typeof schema>;

export default function CreateDossier() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dossierService = new DossierService();
  const dossierJson: Folder[] = [
    {
      title: 'Module 1 Administrative information',
      children: {
        '1.1': { title: 'Forms [Form Type (R)]' },
        '1.2': { title: 'Cover letters' },
        '1.3': {
          title: 'Administrative information',
          children: {
            '1.3.1': {
              title: 'Contact/sponsor/applicant information',
              files: [
                {
                  title: '1.3.1.1 Change of address or corporate name',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                },
                {
                  title: '1.3.1.2 Change in contact/agent',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                },
                {
                  title: '1.3.1.3 Change in sponsor',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                },
                {
                  title: '1.3.1.4 Transfer of obligation',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                },
                {
                  title:
                    '1.3.1.5 Change in ownership of an application or reissuance of license',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                }
              ]
            },
            '1.3.2': {
              title: 'Field copy certification',
              files: [
                {
                  title: 'Field copy certification',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                }
              ]
            },
            '1.3.3': {
              title: 'Debarment certification',
              files: [
                {
                  title: 'Debarment certification',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                }
              ]
            },
            '1.3.4': {
              title: 'Financial certification and disclosure',
              files: [
                {
                  title: 'Financial certification and disclosure',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                }
              ]
            },
            '1.3.5': {
              title: 'Patent and exclusivity',
              children: {
                '1.3.5.1': {
                  title: 'Patent information',
                  files: [
                    {
                      title: 'Patent information',
                      id: uuid(),
                      createdAt: currentTime,
                      documentPublicUrl: null,
                      type: 'file',
                      lastUpdatedAt: currentTime
                    }
                  ]
                },
                '1.3.5.2': {
                  title: 'Patent certification',
                  files: [
                    {
                      title: 'Patent certification',
                      id: uuid(),
                      createdAt: currentTime,
                      documentPublicUrl: null,
                      type: 'file',
                      lastUpdatedAt: currentTime
                    }
                  ]
                },
                '1.3.5.3': {
                  title: 'Exclusivity claim',
                  files: [
                    {
                      title: 'Exclusivity claim',
                      id: uuid(),
                      createdAt: currentTime,
                      documentPublicUrl: null,
                      type: 'file',
                      lastUpdatedAt: currentTime
                    }
                  ]
                }
              }
            },
            '1.3.6': {
              title: 'Tropical disease priority review voucher',
              files: [
                {
                  title: 'Tropical disease priority review voucher',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                }
              ]
            }
          }
        },
        '1.4': {
          title: 'References',
          children: {
            '1.4.1': {
              title: 'Letter of authorization',
              files: [
                {
                  title: 'Letter of authorization',
                  id: uuid(),
                  createdAt: currentTime,
                  documentPublicUrl: null,
                  type: 'file',
                  lastUpdatedAt: currentTime
                }
              ]
            },
            '1.4.2': { title: 'Statement of right of reference' },
            '1.4.3': {
              title: 'List of authorized persons to incorporate by reference'
            },
            '1.4.4': {
              title: 'Cross-reference to previously submitted information'
            }
          }
        },
        '1.5': {
          title: 'Application status',
          children: {
            '1.5.1': { title: 'Withdrawal of an IND' },
            '1.5.2': { title: 'Inactivation request' },
            '1.5.3': { title: 'Reactivation request' },
            '1.5.4': { title: 'Reinstatement request' },
            '1.5.5': {
              title: 'Withdrawal of an unapproved BLA, NDA, ANDA, or Supplement'
            },
            '1.5.6': { title: 'Withdrawal of listed drug' },
            '1.5.7': {
              title:
                'Withdrawal of approval of an application or revocation of license'
            }
          }
        },
        '1.6': {
          title: 'Meetings',
          children: {
            '1.6.1': { title: 'Meeting request' },
            '1.6.2': { title: 'Meeting background materials' },
            '1.6.3': { title: 'Correspondence regarding meetings' }
          }
        },
        '1.7': {
          title: 'Fast Track',
          children: {
            '1.7.1': { title: 'Fast track designation request' },
            '1.7.2': { title: 'Fast track designation withdrawal request' },
            '1.7.3': { title: 'Rolling review request' },
            '1.7.4': {
              title: 'Correspondence regarding fast track/rolling review'
            }
          }
        },
        '1.8': {
          title: 'Special protocol assessment request',
          children: {
            '1.8.1': { title: 'Clinical study' },
            '1.8.2': { title: 'Carcinogenicity study' },
            '1.8.3': { title: 'Stability study' },
            '1.8.4': {
              title: 'Animal efficacy study for approval under the animal rule'
            }
          }
        },
        '1.9': {
          title: 'Pediatric administrative information',
          children: {
            '1.9.1': { title: 'Request for waiver of pediatric studies' },
            '1.9.2': { title: 'Request for deferral of pediatric studies' },
            '1.9.3': {
              title: 'Request for pediatric exclusivity determination'
            },
            '1.9.4': {
              title: 'Proposed pediatric study request and amendments'
            },
            '1.9.6': {
              title:
                'Other correspondence regarding pediatric exclusivity or study plans'
            }
          }
        },
        '1.10': {
          title: 'Dispute resolution',
          children: {
            '1.10.1': { title: 'Request for dispute resolution' },
            '1.10.2': { title: 'Correspondence related to dispute resolution' }
          }
        },
        '1.11': {
          title:
            'Information amendment: Information not covered under modules 2 to 5',
          children: {
            '1.11.1': { title: 'Quality information amendment' },
            '1.11.2': { title: 'Nonclinical information amendment' },
            '1.11.3': { title: 'Clinical information amendment' },
            '1.11.4': { title: 'Multiple module information amendment' }
          }
        },
        '1.12': {
          title: 'Other correspondence',
          children: {
            '1.12.1': { title: 'Pre IND correspondence' },
            '1.12.2': { title: 'Request to charge for clinical trial' },
            '1.12.3': { title: 'Request to charge for investigational drug' },
            '1.12.4': { title: 'Miscellaneous correspondence' }
          }
        },
        '1.13': { title: 'Annual reports' },
        '1.14': { title: 'Adverse Event Reporting Program (AER)' },
        '1.15': { title: 'Promotional labeling and advertising' },
        '1.16': { title: 'Biosimilar User Fee Cover Sheet (351(k) BLA)' }
      }
    },
    { title: 'Module 2 Summaries' },
    { title: 'Module 3 Quality' },
    { title: 'Module 4 Nonclinical Study Reports' },
    { title: 'Module 5 Clinical Study Reports' }
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema)
  });
  const [user, setUser] = useLocalStorage('user', {});
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data: any) => {
    setIsLoading(true);

    const dossierData = {
      title: data.title,
      description: data.description,
      data: dossierJson
    };

    try {
      // const addRegulationResponse = await AddRegulationHandler({
      //   title: data?.title,
      //   description: data?.description,
      //   status: 'pending',
      //   pharmaceutical: user?.uid
      //   // documents, //this is a json of the documents
      // });

      const dossierResponse = await dossierService.createDossier(dossierData);

      toast({
        title: 'Successfully created dossier.'
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Failed to create dossier.'
      });
    } finally {
      setIsLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2">
          <Plus className="h-4 w-4" /> <span>Add Dossier</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add Dossier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input {...register('title')} />
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex justify-end space-x-4 py-5">
              <DialogPrimitive.Close>
                <Button variant="outline" type="button" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogPrimitive.Close>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex flex-row items-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Creating...
                  </span>
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
