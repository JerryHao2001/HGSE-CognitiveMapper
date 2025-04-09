import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Download, Save, HelpCircle, X } from 'lucide-react';
import { toPng } from 'html-to-image';
// Import Harvard shield image
import HarvardShield from '@assets/Harvard_shield-Education.png';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useMap } from '../context/MapContext';
import { saveMap } from '../lib/api';
import { useToast } from '../hooks/use-toast';

export default function Header() {
  const [exportOpen, setExportOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [exportFilename, setExportFilename] = useState('my-cognitive-map');
  const [exportFormat, setExportFormat] = useState('png');
  const [mapName, setMapName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { getMapState } = useMap();
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const canvasElement = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!canvasElement) {
        throw new Error('Could not find canvas element');
      }

      // Get current transform and temporarily reset it for the export
      const currentTransform = canvasElement.style.transform;
      canvasElement.style.transform = 'translate(0px, 0px) scale(1)';

      const dataUrl = await toPng(canvasElement, {
        backgroundColor: '#f8f8f8',
        height: canvasElement.scrollHeight,
        width: canvasElement.scrollWidth,
        style: {
          overflow: 'visible'
        }
      });

      // Restore the original transform
      canvasElement.style.transform = currentTransform;

      // Create a download link
      const link = document.createElement('a');
      link.download = `${exportFilename}.${exportFormat}`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'Export successful',
        description: `Saved as ${exportFilename}.${exportFormat}`,
      });
      
      setExportOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your map.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = async () => {
    if (!mapName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your map',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { nodes, edges } = getMapState();
      await saveMap(mapName, nodes, edges);
      toast({
        title: 'Success',
        description: 'Your map has been saved successfully',
      });
      setSaveOpen(false);
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: 'Save failed',
        description: 'There was an error saving your map',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="bg-crimson text-white shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img 
            src={HarvardShield} 
            alt="Harvard Shield" 
            className="h-9" 
          />
          <h1 className="text-xl font-bold">HGSE Cognitive Map Builder</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="secondary" 
            size="sm"
            className="px-3 py-1 bg-white text-crimson rounded hover:bg-gray-100 transition flex items-center space-x-1"
            onClick={() => setSaveOpen(true)}
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            className="px-3 py-1 bg-white text-crimson rounded hover:bg-gray-100 transition flex items-center space-x-1"
            onClick={() => setExportOpen(true)}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-gray-200 transition">
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Cognitive Map</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="export-filename">Filename</Label>
              <Input 
                id="export-filename" 
                value={exportFilename} 
                onChange={(e) => setExportFilename(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <RadioGroup 
                value={exportFormat} 
                onValueChange={setExportFormat}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="png" />
                  <Label htmlFor="png">PNG Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="svg" id="svg" />
                  <Label htmlFor="svg">SVG Vector</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Download'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Cognitive Map</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="map-name">Map Name</Label>
              <Input 
                id="map-name" 
                value={mapName} 
                onChange={(e) => setMapName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Map'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
