'use client';

import { useState, useMemo } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { AlertCircle, ChevronRight, ChevronLeft, Plus, Trash2, X } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Code, 
  Heading,
  Quote
} from 'lucide-react';

// Types for our form
interface JobFormData {
  jobTitle: string;
  jobCode: string;
  jobDescription: string;
  assignmentLink?: string;
  requiredSkills: string[];
  lastDateToApply: {
    year: string;
    month: string;
    day: string;
  };
  additionalQuestions: {
    question: string;
    type: 'text' | 'multipleChoice';
    options?: string[];
  }[];
}

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 
  'Python', 'Django', 'Flask', 'Java', 'Spring', 
  'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 
  'Ruby on Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'HTML', 'CSS', 'Sass',
  'TailwindCSS', 'Bootstrap', 'Material UI', 'Git', 'CI/CD'
];

export default function CreateJobPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  
  // Generate year, month, and day options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString());
  const months = [
    {value: '01', label: 'January'}, {value: '02', label: 'February'}, 
    {value: '03', label: 'March'}, {value: '04', label: 'April'}, 
    {value: '05', label: 'May'}, {value: '06', label: 'June'}, 
    {value: '07', label: 'July'}, {value: '08', label: 'August'}, 
    {value: '09', label: 'September'}, {value: '10', label: 'October'}, 
    {value: '11', label: 'November'}, {value: '12', label: 'December'}
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors, isValid } } = useForm<JobFormData>({
    defaultValues: {
      jobTitle: '',
      jobCode: '',
      jobDescription: '',
      assignmentLink: '',
      requiredSkills: [],
      lastDateToApply: {
        year: currentYear.toString(),
        month: '01',
        day: '01'
      },
      additionalQuestions: []
    },
    mode: 'onChange'
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalQuestions"
  });
  
  const watchedValues = watch();
  const selectedSkills = watch('requiredSkills') || [];
  
  const availableSkills = useMemo(() => {
    return SKILL_OPTIONS.filter(skill => !selectedSkills.includes(skill));
  }, [selectedSkills]);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline',
        },
      }),
    ],
    content: watchedValues.jobDescription || '',
    onUpdate: ({ editor }) => {
      setValue('jobDescription', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[150px] p-3',
      },
    },
    immediatelyRender: false, // Fix for SSR error
  });

  const onSubmit: SubmitHandler<JobFormData> = (data) => {
    console.log('Form submitted with data:', data);
    // In the future this will dispatch a thunk or action
  };
  
  const addQuestion = () => {
    if (fields.length < 5) {
      append({ question: '', type: 'text', options: [''] });
    }
  };
  
  const addSkill = (skill: string) => {
    const currentSkills = getValues('requiredSkills') || [];
    if (!currentSkills.includes(skill)) {
      setValue('requiredSkills', [...currentSkills, skill]);
    }
    setShowSkillsDropdown(false);
  };
  
  const removeSkill = (skill: string) => {
    const currentSkills = getValues('requiredSkills') || [];
    setValue('requiredSkills', currentSkills.filter(s => s !== skill));
  };

  const canAddMoreQuestions = fields.length < 5;
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Job</h1>
      
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
          step === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
        }`}>
          1
        </div>
        <div className="h-1 flex-1 mx-2 bg-gray-200">
          <div className={`h-full bg-indigo-600 ${step === 1 ? 'w-0' : 'w-full'}`}></div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
          step === 2 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
        }`}>
          2
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                id="jobTitle"
                type="text"
                className={`w-full px-3 py-2 border rounded-md ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                {...register('jobTitle', { required: 'Job title is required' })}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.jobTitle.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="jobCode" className="block text-sm font-medium text-gray-700 mb-1">
                Job Code*
              </label>
              <input
                id="jobCode"
                type="text"
                className={`w-full px-3 py-2 border rounded-md ${errors.jobCode ? 'border-red-500' : 'border-gray-300'}`}
                {...register('jobCode', { required: 'Job code is required' })}
              />
              {errors.jobCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.jobCode.message}
                </p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                  Job Description*
                </label>
              </div>
              
              <div className={`border rounded-md ${errors.jobDescription ? 'border-red-500' : 'border-gray-300'}`}>
                <div className="flex flex-wrap items-center gap-1 p-1 border-b bg-gray-50">
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1 rounded ${
                      editor?.isActive('heading', { level: 2 }) 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Heading 2"
                  >
                    <Heading size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-1 rounded ${
                      editor?.isActive('heading', { level: 3 }) 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Heading 3"
                  >
                    <Heading size={16} />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1 rounded ${
                      editor?.isActive('bold') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Bold"
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded ${
                      editor?.isActive('italic') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Italic"
                  >
                    <Italic size={16} />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-1 rounded ${
                      editor?.isActive('bulletList') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Bullet List"
                  >
                    <List size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`p-1 rounded ${
                      editor?.isActive('orderedList') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Numbered List"
                  >
                    <ListOrdered size={16} />
                  </button>
                  <div className="w-px h-5 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt('Enter URL');
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={`p-1 rounded ${
                      editor?.isActive('link') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Add Link"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                    className={`p-1 rounded ${
                      editor?.isActive('code') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Code"
                  >
                    <Code size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={`p-1 rounded ${
                      editor?.isActive('blockquote') 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'hover:bg-gray-200'
                    }`}
                    title="Quote"
                  >
                    <Quote size={16} />
                  </button>
                </div>
                
                <EditorContent editor={editor} />
              </div>
              
              {errors.jobDescription && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.jobDescription.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="assignmentLink" className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Link (Optional)
              </label>
              <input
                id="assignmentLink"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                {...register('assignmentLink', { 
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Please enter a valid URL'
                  }
                })}
              />
              {errors.assignmentLink && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.assignmentLink.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastDateToApply" className="block text-sm font-medium text-gray-700 mb-1">
                Last Date to Apply*
              </label>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <select
                    {...register('lastDateToApply.year', { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <select
                    {...register('lastDateToApply.month', { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <select
                    {...register('lastDateToApply.day', { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills*
              </label>
              <div className="relative">
                <div 
                  className={`w-full px-3 py-2 border rounded-md flex cursor-pointer min-h-10 ${errors.requiredSkills ? 'border-red-500' : 'border-gray-300'}`}
                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                >
                  {selectedSkills.length === 0 ? (
                    <span className="text-gray-500">Select skills</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedSkills.map(skill => (
                        <div key={skill} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md flex items-center">
                          {skill}
                          <button
                            type="button"
                            className="ml-1 text-indigo-500 hover:text-indigo-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSkill(skill);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {showSkillsDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {availableSkills.length > 0 ? (
                      availableSkills.map(skill => (
                        <div 
                          key={skill}
                          className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                          onClick={() => addSkill(skill)}
                        >
                          {skill}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No more skills available</div>
                    )}
                  </div>
                )}
              </div>
              
              <input 
                type="hidden" 
                {...register('requiredSkills', { 
                  validate: value => (value && value.length > 0) || 'At least one skill is required' 
                })}
              />
              
              {errors.requiredSkills && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.requiredSkills.message}
                </p>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                onClick={() => setStep(2)}
                disabled={!watchedValues.jobTitle || !watchedValues.jobCode || !watchedValues.jobDescription || !selectedSkills.length}
              >
                Next Step
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Additional Questions (Optional)</h2>
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md ${
                    canAddMoreQuestions 
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={addQuestion}
                  disabled={!canAddMoreQuestions}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Question ({fields.length}/5)
                </button>
              </div>
              
              {fields.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <p className="text-gray-500">No additional questions added yet.</p>
                  <button
                    type="button"
                    className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    onClick={addQuestion}
                  >
                    + Add your first question
                  </button>
                </div>
              )}
              
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`additionalQuestions.${index}.question`} className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text*
                      </label>
                      <input
                        id={`additionalQuestions.${index}.question`}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register(`additionalQuestions.${index}.question` as const, { required: true })}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`additionalQuestions.${index}.type`} className="block text-sm font-medium text-gray-700 mb-1">
                        Answer Type
                      </label>
                      <select
                        id={`additionalQuestions.${index}.type`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register(`additionalQuestions.${index}.type` as const)}
                      >
                        <option value="text">Text</option>
                        <option value="multipleChoice">Multiple Choice</option>
                      </select>
                    </div>
                    
                    {watch(`additionalQuestions.${index}.type`) === 'multipleChoice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {watch(`additionalQuestions.${index}.options`)?.map((_, optionIndex) => (
                            <input
                              key={optionIndex}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder={`Option ${optionIndex + 1}`}
                              {...register(`additionalQuestions.${index}.options.${optionIndex}` as const, { required: true })}
                            />
                          ))}
                          <button
                            type="button"
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                            onClick={() => {
                              const currentOptions = watch(`additionalQuestions.${index}.options`) || [];
                              setValue(`additionalQuestions.${index}.options.${currentOptions.length}`, '');
                            }}
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={() => setStep(1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous Step
              </button>
              
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Job
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}