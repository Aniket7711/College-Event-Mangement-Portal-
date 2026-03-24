import { PublicLayout } from '@/components/layout/Layouts';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutPage = () => (
  <PublicLayout>
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">About CampusEvents</h1>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Empowering students and organizers to create memorable campus experiences.
        </p>

        <div className="space-y-12">
          <section className="glass-card p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold mb-2">Our Mission</h2>
                <p className="text-muted-foreground">
                  To streamline campus event management by providing a unified platform where students can discover events, organizers can manage logistics, and administrators can oversee the entire ecosystem with ease.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-card p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold mb-2">Key Features</h2>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Role-based dashboards for students, organizers, and admins</li>
                  <li>QR-based event check-in for fast and secure attendance</li>
                  <li>Smart event discovery with filters and search</li>
                  <li>Real-time notifications and status tracking</li>
                  <li>Feedback and analytics for continuous improvement</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-card p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-semibold mb-2">Our Team</h2>
                <p className="text-muted-foreground">
                  Built by a passionate team of students as a final year project. CampusEvents is designed to be a practical, production-ready solution for college event management.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </PublicLayout>
);

export default AboutPage;
