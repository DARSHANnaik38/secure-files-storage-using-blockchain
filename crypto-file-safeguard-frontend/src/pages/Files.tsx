import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Trash2, Search, Calendar, Hash } from "lucide-react";

interface StoredFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  chunks: number;
  uploadDate: Date;
  status: 'completed' | 'processing' | 'error';
  type: string;
}

const Files = () => {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState<StoredFile[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockFiles: StoredFile[] = [
      {
        id: "1",
        name: "important-document.pdf",
        size: 2048000,
        hash: "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
        chunks: 2000,
        uploadDate: new Date(2024, 0, 15),
        status: 'completed',
        type: 'PDF'
      },
      {
        id: "2", 
        name: "project-photos.zip",
        size: 15360000,
        hash: "0x1a2b3c4d5e6f7890abcdef1234567890fedcba0987654321abcdef1234567890",
        chunks: 15000,
        uploadDate: new Date(2024, 0, 12),
        status: 'completed',
        type: 'ZIP'
      },
      {
        id: "3",
        name: "presentation.pptx",
        size: 5120000,
        hash: "0xabcdef1234567890fedcba0987654321abcdef1234567890fedcba0987654321",
        chunks: 5000,
        uploadDate: new Date(2024, 0, 10),
        status: 'completed',
        type: 'PPTX'
      },
      {
        id: "4",
        name: "backup-data.tar.gz",
        size: 51200000,
        hash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
        chunks: 50000,
        uploadDate: new Date(2024, 0, 8),
        status: 'completed',
        type: 'Archive'
      }
    ];
    setFiles(mockFiles);
    setFilteredFiles(mockFiles);
  }, []);

  useEffect(() => {
    const filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchTerm, files]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleDownload = (file: StoredFile) => {
    // Mock download functionality
    console.log(`Downloading ${file.name}...`);
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            My Secure Files
          </h1>
          <p className="text-muted-foreground">
            All your files are encrypted and stored securely on the blockchain
          </p>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{filteredFiles.length} files</span>
            <span>
              {formatFileSize(filteredFiles.reduce((total, file) => total + file.size, 0))} total
            </span>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm truncate" title={file.name}>
                        {file.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {file.type} • {formatFileSize(file.size)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(file.status)} className="text-xs">
                    {file.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* File Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-primary truncate">
                      {file.hash.substring(0, 20)}...
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {file.uploadDate.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-muted-foreground">
                    {file.chunks.toLocaleString()} chunks stored
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(file)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Upload your first file to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Files;