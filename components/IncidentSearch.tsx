import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function IncidentSearch({placeholderText}: {placeholderText: string}) {
  return (
    <Field className="">
      <ButtonGroup className="">
        <Input id="input-button-group" className="py-4" placeholder={placeholderText} />
        <Button variant="outline" className="py-4">Search</Button>
      </ButtonGroup>
    </Field>
  )
}
